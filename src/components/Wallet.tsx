import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, Minus, History, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import UPIPayment from './UPIPayment';
import { supabase } from '@/integrations/supabase/client';

interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'tournament_payment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description: string;
  transactionId?: string;
  screenshot?: string;
  upiId?: string;
}

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUPI, setWithdrawUPI] = useState('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;

    try {
      // Fetch wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (walletError) throw walletError;
      if (walletData) {
        setBalance(Number(walletData.balance));
      }

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      if (transactionsData) {
        const formattedTransactions = transactionsData.map(t => ({
          id: t.id,
          type: t.type as 'deposit' | 'withdraw' | 'tournament_payment',
          amount: Number(t.amount),
          status: t.status as 'pending' | 'completed' | 'failed',
          timestamp: t.created_at,
          description: t.description || '',
          transactionId: t.transaction_id || undefined,
          screenshot: t.screenshot || undefined,
          upiId: t.upi_id || undefined
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch wallet data",
        variant: "destructive"
      });
    }
  };

  const saveWalletData = async (newBalance: number, newTransaction?: any) => {
    if (!user) return;

    try {
      // Update wallet balance
      await supabase
        .from('wallets')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      // Add transaction if provided
      if (newTransaction) {
        await supabase
          .from('wallet_transactions')
          .insert({
            user_id: user.id,
            type: newTransaction.type,
            amount: newTransaction.amount,
            status: newTransaction.status,
            description: newTransaction.description,
            transaction_id: newTransaction.transactionId,
            screenshot: newTransaction.screenshot,
            upi_id: newTransaction.upiId
          });
      }

      // Refresh data
      fetchWalletData();
    } catch (error) {
      console.error('Error saving wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to save wallet data",
        variant: "destructive"
      });
    }
  };

  const handleDepositSuccess = async (transactionId: string, screenshot?: string) => {
    const amount = parseInt(depositAmount);
    const newTransaction = {
      type: 'deposit',
      amount,
      status: 'pending',
      description: `Deposit request of ₹${amount}`,
      transactionId,
      screenshot
    };

    await saveWalletData(balance, newTransaction); // Don't update balance yet, wait for admin approval

    setShowDeposit(false);
    setDepositAmount('');
    
    toast({
      title: "Deposit Request Submitted!",
      description: "Your deposit request has been sent to admin for approval. You'll be notified once approved.",
    });
  };

  const handleDepositClick = () => {
    if (!depositAmount || parseInt(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
      return;
    }
    setShowDeposit(true);
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    
    if (!withdrawUPI.trim()) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID for withdrawal",
        variant: "destructive"
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    const newTransaction = {
      type: 'withdraw',
      amount,
      status: 'pending',
      description: `Withdrawal request of ₹${amount}`,
      upiId: withdrawUPI
    };

    await saveWalletData(balance, newTransaction); // Keep same balance, don't deduct yet

    setShowWithdraw(false);
    setWithdrawAmount('');
    setWithdrawUPI('');
    
    toast({
      title: "Withdrawal Request Submitted!",
      description: "Your withdrawal request has been sent to admin for approval.",
    });
  };

  const payFromWallet = async (amount: number) => {
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Please deposit money to your wallet first",
        variant: "destructive"
      });
      setShowDeposit(true);
      return false;
    }

    const newBalance = balance - amount;
    const newTransaction = {
      type: 'tournament_payment',
      amount,
      status: 'completed',
      description: `Tournament entry fee payment`
    };

    await saveWalletData(newBalance, newTransaction);
    return true;
  };

  if (showDeposit && depositAmount) {
    return (
      <UPIPayment
        amount={parseInt(depositAmount)}
        description={`Wallet deposit of ₹${depositAmount}`}
        onSuccess={handleDepositSuccess}
        onBack={() => setShowDeposit(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 backdrop-blur-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <IndianRupee className="w-6 h-6 text-cyan-400" />
              </div>
              <span>Wallet Balance</span>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-cyan-400">₹{balance}</div>
              <div className="text-sm text-gray-400">Available Balance</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => setShowDeposit(false)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3"
            >
              <Plus className="w-5 h-5" />
              <span>Add Money</span>
            </Button>
            <Button 
              onClick={() => setShowWithdraw(true)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-3"
            >
              <Minus className="w-5 h-5" />
              <span>Withdraw</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Section */}
      {!showDeposit && (
        <Card className="bg-black/40 border-green-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Plus className="w-5 h-5 text-green-400" />
              </div>
              <span>Add Money to Wallet</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Enter Amount (₹) *
              </label>
              <Input
                type="number"
                placeholder="Enter amount to add"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-green-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[100, 250, 500, 1000, 2000, 5000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(amount.toString())}
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            <Button 
              onClick={handleDepositClick}
              disabled={!depositAmount || parseInt(depositAmount) <= 0}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 font-medium py-3"
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <Card className="bg-black/40 border-orange-500/30 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Minus className="w-5 h-5 text-orange-400" />
              </div>
              <span>Withdraw Money</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Withdrawal Amount (₹) *
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                UPI ID *
              </label>
              <Input
                placeholder="Enter your UPI ID (e.g., user@paytm)"
                value={withdrawUPI}
                onChange={(e) => setWithdrawUPI(e.target.value)}
                className="bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowWithdraw(false)} 
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseInt(withdrawAmount) <= 0 || !withdrawUPI.trim()}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                Request Withdrawal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <History className="w-5 h-5 text-purple-400" />
            </div>
            <span>Transaction History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {transactions.slice().reverse().map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-4 bg-black/30 rounded-lg border border-gray-700/50">
                <div className="flex-1">
                  <p className="text-white font-medium">{transaction.description}</p>
                  <p className="text-gray-400 text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                  {transaction.upiId && (
                    <p className="text-cyan-400 text-xs">UPI: {transaction.upiId}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${
                    transaction.type === 'deposit' ? 'text-green-400' : 
                    transaction.type === 'withdraw' ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                  </p>
                  <p className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed' ? 'text-green-400 bg-green-400/20' :
                    transaction.status === 'pending' ? 'text-yellow-400 bg-yellow-400/20' : 'text-red-400 bg-red-400/20'
                  }`}>
                    {transaction.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No transactions yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
