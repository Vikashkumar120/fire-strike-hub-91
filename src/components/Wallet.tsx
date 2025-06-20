
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import UPIPayment from './UPIPayment';
import { 
  IndianRupee, 
  Plus, 
  Minus, 
  History, 
  Upload, 
  Gift,
  ArrowDownCircle,
  ArrowUpCircle 
} from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  timestamp: string;
  screenshot?: string;
  upi_id?: string;
}

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [canClaimBonus, setCanClaimBonus] = useState(false);
  const [lastBonusDate, setLastBonusDate] = useState<string | null>(null);
  const [showUPIPayment, setShowUPIPayment] = useState(false);
  
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;

    try {
      console.log('Loading wallet data for user:', user.id);
      
      // Load wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletError) {
        console.error('Error loading wallet:', walletError);
        return;
      }

      if (walletData) {
        setBalance(Number(walletData.balance) || 0);
        setCoins(Number(walletData.coins) || 0);
        setLastBonusDate(walletData.last_daily_bonus);
        
        // Check if user can claim daily bonus (once per day)
        const today = new Date().toDateString();
        const lastBonus = walletData.last_daily_bonus ? new Date(walletData.last_daily_bonus).toDateString() : null;
        setCanClaimBonus(!lastBonus || lastBonus !== today);
      } else {
        // Create wallet if doesn't exist
        const { error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 0,
            coins: 0
          });
          
        if (createError) {
          console.error('Error creating wallet:', createError);
        }
      }

      // Load transactions
      const { data: transactionData, error: transactionError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionError) {
        console.error('Error loading transactions:', transactionError);
      } else {
        const formattedTransactions = (transactionData || []).map(t => ({
          id: t.id,
          type: t.type,
          amount: Number(t.amount),
          status: t.status || 'pending',
          description: t.description || '',
          timestamp: t.created_at || '',
          screenshot: t.screenshot || undefined,
          upi_id: t.upi_id || undefined
        }));
        setTransactions(formattedTransactions);
      }

    } catch (error) {
      console.error('Error in loadWalletData:', error);
    }
  };

  const handleDepositClick = () => {
    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid amount (minimum ₹10)",
        variant: "destructive"
      });
      return;
    }

    setShowUPIPayment(true);
  };

  const handleUPIPaymentSuccess = async (transactionId: string, screenshot?: string) => {
    if (!user) return;

    setLoading(true);

    try {
      const amount = parseFloat(depositAmount);
      
      // Create transaction in database
      const { error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'deposit',
          amount: amount,
          status: 'pending',
          description: `Deposit of ₹${amount}`,
          screenshot: screenshot || null,
          transaction_id: transactionId
        });

      if (error) {
        console.error('Deposit error:', error);
        toast({
          title: "Error",
          description: "Could not process deposit. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Add to admin transactions for approval
      const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
      const newTransaction = {
        id: `dep_${Date.now()}`,
        userId: user.id,
        userName: profile?.name || user.email,
        userEmail: user.email,
        type: 'deposit',
        amount: amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        description: `Deposit request from ${profile?.name || user.email}`,
        screenshot: screenshot,
        transactionId: transactionId
      };
      adminTransactions.push(newTransaction);
      localStorage.setItem('adminTransactions', JSON.stringify(adminTransactions));

      toast({
        title: "Deposit Submitted!",
        description: "Your deposit request has been submitted for approval",
      });

      setDepositAmount('');
      setShowUPIPayment(false);
      loadWalletData();

    } catch (error) {
      console.error('Deposit exception:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount || !upiId) {
      toast({
        title: "Error",
        description: "Please enter amount and UPI ID",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount < 50) {
      toast({
        title: "Error",
        description: "Minimum withdrawal amount is ₹50",
        variant: "destructive"
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Deduct from balance first
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ 
          balance: balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (walletError) {
        console.error('Wallet update error:', walletError);
        toast({
          title: "Error",
          description: "Could not process withdrawal. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create transaction
      const { error } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'withdraw',
          amount: amount,
          status: 'pending',
          description: `Withdrawal of ₹${amount}`,
          upi_id: upiId
        });

      if (error) {
        console.error('Transaction creation error:', error);
        // Revert balance if transaction creation fails
        await supabase
          .from('wallets')
          .update({ balance: balance })
          .eq('user_id', user.id);
        
        toast({
          title: "Error",
          description: "Could not process withdrawal. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Add to admin transactions for approval
      const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
      const newTransaction = {
        id: `with_${Date.now()}`,
        userId: user.id,
        userName: profile?.name || user.email,
        userEmail: user.email,
        type: 'withdraw',
        amount: amount,
        status: 'pending',
        timestamp: new Date().toISOString(),
        description: `Withdrawal request from ${profile?.name || user.email}`,
        upiId: upiId
      };
      adminTransactions.push(newTransaction);
      localStorage.setItem('adminTransactions', JSON.stringify(adminTransactions));

      toast({
        title: "Withdrawal Submitted!",
        description: "Your withdrawal request has been submitted for approval",
      });

      setWithdrawAmount('');
      setUpiId('');
      loadWalletData();

    } catch (error) {
      console.error('Withdrawal exception:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDailyBonus = async () => {
    if (!user || !canClaimBonus) return;

    setLoading(true);

    try {
      const bonusCoins = 100;
      const newCoins = coins + bonusCoins;
      const today = new Date().toISOString();

      // Update wallet with bonus coins and last bonus date
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ 
          coins: newCoins,
          last_daily_bonus: today,
          updated_at: today
        })
        .eq('user_id', user.id);

      if (walletError) {
        console.error('Daily bonus error:', walletError);
        toast({
          title: "Error",
          description: "Could not claim daily bonus. Please try again.",
          variant: "destructive"
        });
        return;
      }

      // Create transaction record
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          type: 'prize',
          amount: 0,
          coins: bonusCoins,
          status: 'completed',
          description: 'Daily bonus coins'
        });

      setCoins(newCoins);
      setCanClaimBonus(false);
      setLastBonusDate(today);

      toast({
        title: "Daily Bonus Claimed!",
        description: `You received ${bonusCoins} coins!`,
      });

      loadWalletData();

    } catch (error) {
      console.error('Daily bonus exception:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Please login to access your wallet</p>
      </div>
    );
  }

  return (
    <>
      {showUPIPayment && (
        <UPIPayment
          amount={parseFloat(depositAmount)}
          description={`Wallet deposit of ₹${depositAmount}`}
          onSuccess={handleUPIPaymentSuccess}
          onBack={() => setShowUPIPayment(false)}
        />
      )}

      <div className="space-y-6">
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm">Wallet Balance</p>
                  <p className="text-2xl font-bold text-white">₹{balance.toFixed(2)}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm">Coins</p>
                  <p className="text-2xl font-bold text-white">{coins}</p>
                </div>
                <Gift className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardContent className="p-6">
              <Button
                onClick={handleDailyBonus}
                disabled={!canClaimBonus || loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700"
              >
                <Gift className="w-4 h-4 mr-2" />
                {canClaimBonus ? 'Claim Daily Bonus' : 'Bonus Claimed Today'}
              </Button>
              {lastBonusDate && (
                <p className="text-xs text-purple-300 mt-2 text-center">
                  Last claimed: {new Date(lastBonusDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/30 border border-purple-500/20">
            <TabsTrigger value="deposit" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600">
              <Plus className="w-4 h-4 mr-2" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600">
              <Minus className="w-4 h-4 mr-2" />
              Withdraw
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-6 mt-6">
            <Card className="bg-black/30 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowDownCircle className="w-5 h-5 mr-2 text-green-400" />
                  Add Money to Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount (min ₹10)"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                  />
                </div>

                <Button
                  onClick={handleDepositClick}
                  disabled={loading || !depositAmount}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6 mt-6">
            <Card className="bg-black/30 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowUpCircle className="w-5 h-5 mr-2 text-red-400" />
                  Withdraw Money
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹)</label>
                  <Input
                    type="number"
                    placeholder="Enter amount (min ₹50)"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Available balance: ₹{balance.toFixed(2)}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">UPI ID</label>
                  <Input
                    type="text"
                    placeholder="your-upi@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="bg-black/20 border-gray-600 text-white"
                  />
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={loading || !withdrawAmount || !upiId}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {loading ? 'Processing...' : 'Submit Withdrawal Request'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6 mt-6">
            <Card className="bg-black/30 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <History className="w-5 h-5 mr-2 text-blue-400" />
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-gray-600">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{transaction.description}</span>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </span>
                            <span className={`font-bold ${transaction.type === 'deposit' || transaction.type === 'prize' ? 'text-green-400' : 'text-red-400'}`}>
                              {transaction.type === 'deposit' || transaction.type === 'prize' ? '+' : '-'}₹{transaction.amount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No transactions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Wallet;
