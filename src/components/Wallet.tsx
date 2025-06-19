import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, Minus, History, CreditCard, Smartphone, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WalletData {
  id: string;
  balance: number;
  coins: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  last_daily_bonus?: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  coins?: number;
  status: string;
  description: string;
  created_at: string;
  user_id?: string;
  wallet_id?: string;
  transaction_id?: string;
  screenshot?: string;
  upi_id?: string;
  admin_notes?: string;
  updated_at?: string;
}

const Wallet = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [canClaimDaily, setCanClaimDaily] = useState(false);

  // Convert coins to rupees (500 coins = 5 rupees)
  const coinsToRupees = (coins: number) => (coins / 100).toFixed(2);
  const rupeesToCoins = (rupees: number) => rupees * 100;

  useEffect(() => {
    if (user) {
      loadWalletData();
      loadTransactions();
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;
    
    try {
      console.log('Loading wallet data for user:', user.id);
      
      let { data: walletData, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log('Wallet not found, creating new wallet with welcome bonus');
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 5, // ₹5 welcome bonus
            coins: 520 // 20 welcome coins + 500 coins (₹5)
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating wallet:', createError);
          throw createError;
        }
        
        // Add welcome transaction
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: user.id,
            wallet_id: newWallet.id,
            type: 'welcome_bonus',
            amount: 5,
            coins: 520,
            status: 'completed',
            description: 'Welcome bonus: ₹5 + 20 coins'
          });
        
        walletData = newWallet;
        
        toast({
          title: "Welcome! 🎉",
          description: "You got ₹5 + 20 coins as welcome bonus!"
        });
      } else if (error) {
        console.error('Error fetching wallet:', error);
        throw error;
      }

      console.log('Wallet data loaded:', walletData);
      setWallet(walletData);
      
      // Check if daily bonus can be claimed
      checkDailyBonus(walletData);
      
      setLoading(false);
    } catch (error) {
      console.error('Error in loadWalletData:', error);
      toast({
        title: "Wallet Error",
        description: "Could not load wallet data",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const checkDailyBonus = (walletData: WalletData) => {
    if (!walletData.last_daily_bonus) {
      setCanClaimDaily(true);
      return;
    }
    
    const lastBonus = new Date(walletData.last_daily_bonus);
    const today = new Date();
    const diffTime = today.getTime() - lastBonus.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setCanClaimDaily(diffDays >= 1);
  };

  const claimDailyBonus = async () => {
    if (!wallet || !canClaimDaily) return;
    
    setActionLoading(true);
    
    try {
      const bonusCoins = 30;
      const newCoins = (wallet.coins || 0) + bonusCoins;
      
      // Update wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          coins: newCoins,
          last_daily_bonus: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

      // Add transaction
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user!.id,
          wallet_id: wallet.id,
          type: 'daily_bonus',
          amount: 0,
          coins: bonusCoins,
          status: 'completed',
          description: `Daily bonus: ${bonusCoins} coins`
        });

      setWallet({ ...wallet, coins: newCoins, last_daily_bonus: new Date().toISOString() });
      setCanClaimDaily(false);
      await loadTransactions();
      
      toast({
        title: "Daily Bonus Claimed! 🎁",
        description: `You got ${bonusCoins} coins!`
      });
    } catch (error) {
      console.error('Daily bonus error:', error);
      toast({
        title: "Bonus Failed",
        description: "Could not claim daily bonus",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      const transactionData = (data || []).map(item => ({
        id: item.id,
        type: item.type,
        amount: item.amount,
        coins: item.coins || 0,
        status: item.status || 'pending',
        description: item.description || '',
        created_at: item.created_at,
        user_id: item.user_id,
        wallet_id: item.wallet_id,
        transaction_id: item.transaction_id,
        screenshot: item.screenshot,
        upi_id: item.upi_id,
        admin_notes: item.admin_notes,
        updated_at: item.updated_at
      })) as Transaction[];

      setTransactions(transactionData);
    } catch (error) {
      console.error('Error in loadTransactions:', error);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !wallet) return;
    
    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(true);
    
    try {
      // Create transaction record
      const { error: txnError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user!.id,
          wallet_id: wallet.id,
          type: 'deposit',
          amount: depositAmount,
          coins: 0,
          status: 'completed',
          description: `Deposit of ₹${depositAmount}`
        });

      if (txnError) {
        console.error('Transaction error:', txnError);
        throw txnError;
      }

      // Update wallet balance
      const newBalance = wallet.balance + depositAmount;
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) {
        console.error('Wallet update error:', updateError);
        throw updateError;
      }

      setWallet({ ...wallet, balance: newBalance });
      setAmount('');
      await loadTransactions();
      
      toast({
        title: "Deposit Successful",
        description: `₹${depositAmount} added to your wallet`
      });
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Failed",
        description: "Could not process deposit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !wallet) return;
    
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount > wallet.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(true);
    
    try {
      // Create transaction record
      const { error: txnError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user!.id,
          wallet_id: wallet.id,
          type: 'withdraw',
          amount: withdrawAmount,
          coins: 0,
          status: 'pending',
          description: `Withdrawal of ₹${withdrawAmount}`
        });

      if (txnError) {
        console.error('Transaction error:', txnError);
        throw txnError;
      }

      // Update wallet balance
      const newBalance = wallet.balance - withdrawAmount;
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) {
        console.error('Wallet update error:', updateError);
        throw updateError;
      }

      setWallet({ ...wallet, balance: newBalance });
      setAmount('');
      await loadTransactions();
      
      toast({
        title: "Withdrawal Requested",
        description: `₹${withdrawAmount} withdrawal is being processed`
      });
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Withdrawal Failed",
        description: "Could not process withdrawal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const convertCoinsToMoney = async () => {
    if (!wallet || wallet.coins < 500) {
      toast({
        title: "Insufficient Coins",
        description: "You need at least 500 coins to convert to money",
        variant: "destructive"
      });
      return;
    }

    setActionLoading(true);
    
    try {
      const coinsToConvert = Math.floor(wallet.coins / 100) * 100; // Convert in multiples of 100
      const rupeesToAdd = coinsToConvert / 100;
      
      const newBalance = wallet.balance + rupeesToAdd;
      const newCoins = wallet.coins - coinsToConvert;

      // Update wallet
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          coins: newCoins,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

      // Add transaction
      await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user!.id,
          wallet_id: wallet.id,
          type: 'coin_conversion',
          amount: rupeesToAdd,
          coins: -coinsToConvert,
          status: 'completed',
          description: `Converted ${coinsToConvert} coins to ₹${rupeesToAdd}`
        });

      setWallet({ ...wallet, balance: newBalance, coins: newCoins });
      await loadTransactions();
      
      toast({
        title: "Conversion Successful",
        description: `${coinsToConvert} coins converted to ₹${rupeesToAdd}`
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Conversion Failed",
        description: "Could not convert coins",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="w-4 h-4 text-green-400" />;
      case 'withdraw':
        return <Minus className="w-4 h-4 text-red-400" />;
      case 'tournament_payment':
        return <CreditCard className="w-4 h-4 text-blue-400" />;
      case 'prize':
      case 'welcome_bonus':
      case 'daily_bonus':
        return <Gift className="w-4 h-4 text-yellow-400" />;
      case 'coin_conversion':
        return <WalletIcon className="w-4 h-4 text-purple-400" />;
      default:
        return <History className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <WalletIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-spin" />
        <p className="text-gray-400">Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <WalletIcon className="w-6 h-6 mr-2 text-cyan-400" />
            Wallet & Coins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                ₹{wallet?.balance?.toFixed(2) || '0.00'}
              </div>
              <p className="text-gray-300">Wallet Balance</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {wallet?.coins || 0}
              </div>
              <p className="text-gray-300">Coins (500 coins = ₹5)</p>
            </div>
          </div>

          {/* Daily Bonus */}
          {canClaimDaily && (
            <div className="mb-4">
              <Button
                onClick={claimDailyBonus}
                disabled={actionLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
              >
                <Gift className="w-4 h-4 mr-2" />
                {actionLoading ? 'Claiming...' : 'Claim Daily Bonus (30 Coins)'}
              </Button>
            </div>
          )}

          {/* Convert Coins */}
          {wallet && wallet.coins >= 500 && (
            <div className="mb-4">
              <Button
                onClick={convertCoinsToMoney}
                disabled={actionLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                <WalletIcon className="w-4 h-4 mr-2" />
                {actionLoading ? 'Converting...' : `Convert ${Math.floor(wallet.coins / 100) * 100} Coins to ₹${Math.floor(wallet.coins / 100)}`}
              </Button>
            </div>
          )}

          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/30">
              <TabsTrigger value="deposit" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Deposit
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                Withdraw
              </TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Amount to Deposit
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/20 border-gray-600 text-white"
                />
              </div>
              <Button
                onClick={handleDeposit}
                disabled={actionLoading || !amount}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                {actionLoading ? 'Processing...' : 'Deposit Money'}
              </Button>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Amount to Withdraw
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-black/20 border-gray-600 text-white"
                />
              </div>
              <Button
                onClick={handleWithdraw}
                disabled={actionLoading || !amount}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              >
                <Minus className="w-4 h-4 mr-2" />
                {actionLoading ? 'Processing...' : 'Withdraw Money'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <History className="w-6 h-6 mr-2 text-cyan-400" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(transaction.created_at).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {transaction.amount > 0 && (
                      <p className={`font-medium ${
                        transaction.type === 'deposit' || transaction.type === 'prize' || transaction.type === 'welcome_bonus' || transaction.type === 'coin_conversion'
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {transaction.type === 'deposit' || transaction.type === 'prize' || transaction.type === 'welcome_bonus' || transaction.type === 'coin_conversion' ? '+' : '-'}
                        ₹{transaction.amount}
                      </p>
                    )}
                    {transaction.coins && transaction.coins !== 0 && (
                      <p className={`font-medium text-sm ${
                        transaction.coins > 0 ? 'text-yellow-400' : 'text-orange-400'
                      }`}>
                        {transaction.coins > 0 ? '+' : ''}{transaction.coins} coins
                      </p>
                    )}
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
