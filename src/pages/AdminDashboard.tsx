
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

interface Transaction {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  type: string;
  amount: number;
  status: string;
  timestamp: string;
  description: string;
  screenshot?: string;
  upiId?: string;
  transactionId?: string;
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
  const [userActivity, setUserActivity] = useState([]);
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
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      loadAdminData();
      fetchUsers();
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

  const loadAdminData = () => {
    try {
      console.log('Loading admin transaction history...');
      // Load admin transaction history from localStorage
      const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
      console.log('Admin transactions loaded:', adminTransactions);
      setTransactions(adminTransactions);

      // Load user activity
      const activity = JSON.parse(localStorage.getItem('userActivity') || '[]');
      setUserActivity(activity);
      
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
      await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('type', 'deposit')
        .eq('amount', amount)
        .eq('status', 'pending');

      // Update admin transactions in localStorage
      const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
      const updatedTransactions = adminTransactions.map((t: any) => 
        t.id === transactionId ? { ...t, status: 'completed', approvedAt: new Date().toISOString() } : t
      );
      localStorage.setItem('adminTransactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
      
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

  const handleRejectTransaction = (transactionId: string, type: string) => {
    const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
    const updatedTransactions = adminTransactions.map((t: any) => 
      t.id === transactionId ? { ...t, status: 'failed', rejectedAt: new Date().toISOString() } : t
    );
    localStorage.setItem('adminTransactions', JSON.stringify(updatedTransactions));

    // If it's a withdrawal rejection, refund the money to user's wallet
    if (type === 'withdraw') {
      const transaction = adminTransactions.find((t: any) => t.id === transactionId);
      if (transaction) {
        // In a real app, you'd update the database here
        supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', transaction.userId)
          .single()
          .then(({ data }) => {
            if (data) {
              const newBalance = (Number(data.balance) || 0) + transaction.amount;
              supabase
                .from('wallets')
                .update({ balance: newBalance })
                .eq('user_id', transaction.userId);
            }
          });
      }
    }

    setTransactions(updatedTransactions);
    
    toast({
      title: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} Rejected`,
      description: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request has been rejected${type === 'withdraw' ? ' and amount refunded' : ''}`,
    });
  };

  const handleApproveWithdrawal = async (transactionId: string, userId: string, amount: number) => {
    try {
      // Update transaction status in database
      await supabase
        .from('wallet_transactions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('type', 'withdraw')
        .eq('amount', amount)
        .eq('status', 'pending');

      // Update admin transactions
      const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
      const updatedTransactions = adminTransactions.map((t: any) => 
        t.id === transactionId ? { ...t, status: 'completed', approvedAt: new Date().toISOString() } : t
      );
      localStorage.setItem('adminTransactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
      
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
            <Card className="bg-black/30 border-green-500/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <ArrowDownCircle className="w-5 h-5 mr-2 text-green-400" />
                    Pending Deposit Approvals ({pendingDeposits.length})
                  </div>
                  <Button 
                    onClick={loadAdminData}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingDeposits.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-green-500/20">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{transaction.userName}</h3>
                          <span className="text-green-400 font-bold text-lg">₹{transaction.amount}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">{transaction.description}</p>
                        {transaction.transactionId && (
                          <p className="text-cyan-400 text-sm">Transaction ID: {transaction.transactionId}</p>
                        )}
                        <p className="text-gray-500 text-xs">{new Date(transaction.timestamp).toLocaleString()}</p>
                        {transaction.screenshot && (
                          <a 
                            href={transaction.screenshot} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-400 text-xs hover:underline mt-2 inline-block"
                          >
                            📷 View Payment Screenshot
                          </a>
                        )}
                      </div>
                      <div className="flex gap-3 ml-4">
                        <Button 
                          onClick={() => handleApproveDeposit(transaction.id, transaction.userId!, transaction.amount)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleRejectTransaction(transaction.id, 'deposit')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingDeposits.length === 0 && (
                    <div className="text-center py-8">
                      <ArrowDownCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No pending deposit approvals</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-orange-500/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowUpCircle className="w-5 h-5 mr-2 text-orange-400" />
                  Pending Withdrawal Approvals ({pendingWithdrawals.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pendingWithdrawals.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-orange-500/20">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{transaction.userName}</h3>
                          <span className="text-orange-400 font-bold text-lg">₹{transaction.amount}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">{transaction.description}</p>
                        {transaction.upiId && (
                          <p className="text-cyan-400 text-sm">UPI ID: {transaction.upiId}</p>
                        )}
                        <p className="text-gray-500 text-xs">{new Date(transaction.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-3 ml-4">
                        <Button 
                          onClick={() => handleApproveWithdrawal(transaction.id, transaction.userId!, transaction.amount)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleRejectTransaction(transaction.id, 'withdraw')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingWithdrawals.length === 0 && (
                    <div className="text-center py-8">
                      <ArrowUpCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No pending withdrawal approvals</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                    Tournaments Joined
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-yellow-400">
                    {userActivity.filter((a: any) => a.action === 'joined_tournament').length}
                  </p>
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
