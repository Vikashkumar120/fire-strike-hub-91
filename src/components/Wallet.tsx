
import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, Minus, History, CreditCard, Smartphone } from 'lucide-react';
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
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'tournament_payment' | 'prize';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  created_at: string;
}

const Wallet = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [amount, setAmount] = useState('');

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
      
      // First try to get existing wallet
      let { data: walletData, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Wallet doesn't exist, create one
        console.log('Wallet not found, creating new wallet');
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 100 // Starting bonus
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating wallet:', createError);
          throw createError;
        }
        
        walletData = newWallet;
      } else if (error) {
        console.error('Error fetching wallet:', error);
        throw error;
      }

      console.log('Wallet data loaded:', walletData);
      setWallet(walletData);
      setLoading(false);
    } catch (error) {
      console.error('Error in loadWalletData:', error);
      toast({
        title: "Wallet Error",
        description: "Could not load wallet data. Creating new wallet...",
        variant: "destructive"
      });
      
      // Try to create wallet as fallback
      try {
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 100
          })
          .select()
          .single();

        if (!createError && newWallet) {
          setWallet(newWallet);
          toast({
            title: "Wallet Created",
            description: "New wallet created with ₹100 bonus!"
          });
        }
      } catch (createError) {
        console.error('Failed to create wallet:', createError);
      }
      
      setLoading(false);
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

      setTransactions(data || []);
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
      const { data: transaction, error: txnError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user!.id,
          wallet_id: wallet.id,
          type: 'deposit',
          amount: depositAmount,
          status: 'completed',
          description: `Deposit of ₹${depositAmount}`
        })
        .select()
        .single();

      if (txnError) throw txnError;

      // Update wallet balance
      const newBalance = wallet.balance + depositAmount;
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

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
          status: 'pending',
          description: `Withdrawal of ₹${withdrawAmount}`
        });

      if (txnError) throw txnError;

      // Update wallet balance
      const newBalance = wallet.balance - withdrawAmount;
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) throw updateError;

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
        return <Plus className="w-4 h-4 text-yellow-400" />;
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
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-cyan-400 mb-2">
              ₹{wallet?.balance?.toFixed(2) || '0.00'}
            </div>
            <p className="text-gray-300">Available Balance</p>
          </div>

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
                    <p className={`font-medium ${
                      transaction.type === 'deposit' || transaction.type === 'prize' 
                        ? 'text-green-400' 
                        : 'text-red-400'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'prize' ? '+' : '-'}
                      ₹{transaction.amount}
                    </p>
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
