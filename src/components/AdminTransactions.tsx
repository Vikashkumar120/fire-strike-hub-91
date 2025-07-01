
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Transaction {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  description?: string;
  screenshot?: string;
  upi_id?: string;
  transaction_id?: string;
  profiles?: {
    name: string;
    email: string;
  };
}

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      console.log('Fetching transactions...');
      
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select(`
          *,
          profiles(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: `Failed to load transactions: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Transactions fetched:', data);
      setTransactions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (transaction: Transaction) => {
    try {
      console.log('Approving deposit:', transaction);
      
      // First, get current wallet balance
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', transaction.user_id)
        .single();

      if (walletError) {
        console.error('Error fetching wallet:', walletError);
        toast({
          title: "Error",
          description: "Failed to fetch wallet data",
          variant: "destructive"
        });
        return;
      }

      if (!walletData) {
        toast({
          title: "Error",
          description: "Wallet not found",
          variant: "destructive"
        });
        return;
      }

      // Calculate new balance
      const currentBalance = Number(walletData.balance) || 0;
      const newBalance = currentBalance + Number(transaction.amount);

      // Update wallet balance
      const { error: updateWalletError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', transaction.user_id);

      if (updateWalletError) {
        console.error('Error updating wallet:', updateWalletError);
        toast({
          title: "Error",
          description: "Failed to update wallet balance",
          variant: "destructive"
        });
        return;
      }

      // Update transaction status
      const { error: updateTxnError } = await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateTxnError) {
        console.error('Error updating transaction:', updateTxnError);
        toast({
          title: "Error",
          description: "Failed to update transaction status",
          variant: "destructive"
        });
        return;
      }

      // Refresh transactions
      await fetchTransactions();
      
      toast({
        title: "Deposit Approved!",
        description: `₹${transaction.amount} added to ${transaction.profiles?.name}'s wallet`,
      });

    } catch (error) {
      console.error('Error approving deposit:', error);
      toast({
        title: "Error",
        description: "Failed to approve deposit",
        variant: "destructive"
      });
    }
  };

  const handleRejectTransaction = async (transaction: Transaction) => {
    try {
      // Update transaction status to failed
      const { error } = await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) {
        console.error('Error rejecting transaction:', error);
        toast({
          title: "Error",
          description: "Failed to reject transaction",
          variant: "destructive"
        });
        return;
      }

      // If it's a withdrawal, refund the money
      if (transaction.type === 'withdraw') {
        const { data: walletData } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', transaction.user_id)
          .single();

        if (walletData) {
          const newBalance = (Number(walletData.balance) || 0) + Number(transaction.amount);
          await supabase
            .from('wallets')
            .update({ balance: newBalance })
            .eq('user_id', transaction.user_id);
        }
      }

      await fetchTransactions();
      
      toast({
        title: `${transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'} Rejected`,
        description: `Transaction has been rejected${transaction.type === 'withdraw' ? ' and amount refunded' : ''}`,
      });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    }
  };

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const completedTransactions = transactions.filter(t => t.status === 'completed');

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-black/30 border-purple-500/20">
          <CardContent className="p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
            <p className="text-white">Loading transactions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Transactions */}
      <Card className="bg-black/30 border-yellow-500/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <ArrowDownCircle className="w-5 h-5 mr-2 text-yellow-400" />
              Pending Transactions ({pendingTransactions.length})
            </div>
            <Button onClick={fetchTransactions} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Details</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{transaction.profiles?.name || 'Unknown User'}</p>
                        <p className="text-gray-400 text-sm">{transaction.profiles?.email || 'No email'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.type === 'deposit' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {transaction.type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-white font-bold">₹{transaction.amount}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {transaction.description && (
                          <p className="text-gray-300">{transaction.description}</p>
                        )}
                        {transaction.transaction_id && (
                          <p className="text-cyan-400">ID: {transaction.transaction_id}</p>
                        )}
                        {transaction.upi_id && (
                          <p className="text-purple-400">UPI: {transaction.upi_id}</p>
                        )}
                        {transaction.screenshot && (
                          <a 
                            href={transaction.screenshot} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline text-xs"
                          >
                            📷 View Screenshot
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleApproveDeposit(transaction)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleRejectTransaction(transaction)}
                          size="sm"
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <ArrowDownCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No pending transactions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Completed Transactions */}
      <Card className="bg-black/30 border-green-500/20 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            Recent Completed Transactions ({completedTransactions.slice(0, 10).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedTransactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Type</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedTransactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{transaction.profiles?.name || 'Unknown User'}</p>
                        <p className="text-gray-400 text-sm">{transaction.profiles?.email || 'No email'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        transaction.type === 'deposit' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {transaction.type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-white font-bold">₹{transaction.amount}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                        COMPLETED
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No completed transactions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;
