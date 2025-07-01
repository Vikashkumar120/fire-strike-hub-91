import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, Trophy, Calendar, Settings, Plus, CreditCard, ArrowDownCircle, ArrowUpCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import MatchResultsManagement from '@/components/MatchResultsManagement';
import TournamentCreation from '@/components/TournamentCreation';
import TournamentManagement from '@/components/TournamentManagement';
import AdminTransactions from '@/components/AdminTransactions';

interface Transaction {
  id: string;
  user_id?: string;
  userName?: string;
  userEmail?: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  description: string;
  screenshot?: string;
  upi_id?: string;
  transaction_id?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  is_admin: boolean;
  created_at: string;
}

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, user } = useAuth();

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  useEffect(() => {
    loadAdminData();
    fetchUsers();
    fetchTransactions();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      loadAdminData();
      fetchUsers();
      fetchTransactions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users from database...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: `Failed to load users: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Users loaded from database:', data);
      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      console.log('Fetching transactions from database...');
      
      // First get all transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('wallet_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Error fetching transactions:', transactionsError);
        return;
      }

      // Then get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      console.log('Transactions loaded from database:', transactionsData);
      
      // Transform data to match expected format with manual joins
      const transformedTransactions = transactionsData?.map(transaction => {
        const profile = profilesData?.find(p => p.id === transaction.user_id);
        return {
          id: transaction.id,
          user_id: transaction.user_id,
          userName: profile?.name || 'Unknown User',
          userEmail: profile?.email || '',
          type: transaction.type,
          amount: Number(transaction.amount),
          status: transaction.status || 'pending',
          created_at: transaction.created_at,
          description: transaction.description || '',
          screenshot: transaction.screenshot,
          upi_id: transaction.upi_id,
          transaction_id: transaction.transaction_id
        };
      }) || [];

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const loadAdminData = () => {
    try {
      console.log('Loading admin transaction history...');
      // Load admin transaction history from localStorage as backup
      const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
      console.log('Admin transactions loaded from localStorage:', adminTransactions);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleApproveDeposit = async (transactionId: string, userId: string, amount: number) => {
    try {
      console.log('Approving deposit:', { transactionId, userId, amount });
      
      // Update user's wallet balance in database
      const { data: walletData, error: fetchError } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching wallet:', fetchError);
        toast({
          title: "Error",
          description: "Failed to fetch wallet data",
          variant: "destructive"
        });
        return;
      }

      const newBalance = (Number(walletData.balance) || 0) + amount;
      
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        toast({
          title: "Error",
          description: "Failed to update wallet balance",
          variant: "destructive"
        });
        return;
      }

      // Update transaction status in database
      const { error: txnError } = await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (txnError) {
        console.error('Error updating transaction:', txnError);
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
        description: `₹${amount} has been added to user's wallet`,
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

  const handleRejectTransaction = async (transactionId: string, type: string) => {
    try {
      // Update transaction status to failed
      const { error } = await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) {
        console.error('Error rejecting transaction:', error);
        toast({
          title: "Error",
          description: "Failed to reject transaction",
          variant: "destructive"
        });
        return;
      }

      // If it's a withdrawal rejection, refund the money to user's wallet
      if (type === 'withdraw') {
        const transaction = transactions.find(t => t.id === transactionId);
        if (transaction && transaction.user_id) {
          const { data: walletData } = await supabase
            .from('wallets')
            .select('balance')
            .eq('user_id', transaction.user_id)
            .single();

          if (walletData) {
            const newBalance = (Number(walletData.balance) || 0) + transaction.amount;
            await supabase
              .from('wallets')
              .update({ balance: newBalance })
              .eq('user_id', transaction.user_id);
          }
        }
      }

      // Refresh transactions
      await fetchTransactions();
      
      toast({
        title: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Rejected`,
        description: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request has been rejected${type === 'withdraw' ? ' and amount refunded' : ''}`,
      });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
    }
  };

  const handleApproveWithdrawal = async (transactionId: string, userId: string, amount: number) => {
    try {
      // Update transaction status in database
      const { error } = await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) {
        console.error('Error approving withdrawal:', error);
        toast({
          title: "Error",
          description: "Failed to approve withdrawal",
          variant: "destructive"
        });
        return;
      }

      // Refresh transactions
      await fetchTransactions();
      
      toast({
        title: "Withdrawal Approved!",
        description: `₹${amount} withdrawal has been approved`,
      });

    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to approve withdrawal",
        variant: "destructive"
      });
    }
  };

  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdraw' && t.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center space-x-2 text-gray-300">
            <Settings className="w-5 h-5" />
            <span>Management Panel</span>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-black/30 border border-purple-500/20">
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="transactions" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger 
              value="create-tournament" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger 
              value="manage-tournaments" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Manage
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card className="bg-black/30 border-blue-500/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-400" />
                    Registered Users ({users.length})
                  </div>
                  <Button 
                    onClick={fetchUsers}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 bg-black/20 rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : users.length > 0 ? (
                    users.map((userProfile) => (
                      <div key={userProfile.id} className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-blue-500/20">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-white font-semibold">{userProfile.name}</h3>
                            {userProfile.is_admin && (
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm mb-1">Email: {userProfile.email}</p>
                          {userProfile.phone && (
                            <p className="text-gray-300 text-sm mb-1">Phone: {userProfile.phone}</p>
                          )}
                          <p className="text-gray-500 text-xs">
                            Joined: {new Date(userProfile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No users found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6 mt-6">
            <AdminTransactions />
          </TabsContent>

          <TabsContent value="create-tournament" className="space-y-6 mt-6">
            <TournamentCreation />
          </TabsContent>

          <TabsContent value="manage-tournaments" className="space-y-6 mt-6">
            <TournamentManagement />
          </TabsContent>

          <TabsContent value="matches" className="space-y-6 mt-6">
            <MatchResultsManagement />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-black/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-cyan-400">{users.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Total Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-400">{transactions.length}</p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Approved Deposits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-400">
                    {transactions.filter(t => t.type === 'deposit' && t.status === 'completed').length}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ArrowUpCircle className="w-5 h-5 mr-2" />
                    Approved Withdrawals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-400">
                    {transactions.filter(t => t.type === 'withdraw' && t.status === 'completed').length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
