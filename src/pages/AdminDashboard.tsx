import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, Trophy, Calendar, Settings, Plus, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MatchResultsManagement from '@/components/MatchResultsManagement';
import TournamentCreation from '@/components/TournamentCreation';

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
}

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userActivity, setUserActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('deposits');
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // Load admin transaction history from localStorage
    const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
    setTransactions(adminTransactions);

    // Load user activity
    const activity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    setUserActivity(activity);
  };

  const handleApproveDeposit = (transactionId: string, userId: string, amount: number) => {
    // Update user's wallet balance
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[userId] || { balance: 0, transactions: [] };
    
    // Add money to user's wallet
    userWallet.balance += amount;
    
    // Update transaction status to completed
    userWallet.transactions = userWallet.transactions.map((t: any) => 
      t.id === transactionId ? { ...t, status: 'completed' } : t
    );
    
    walletData[userId] = userWallet;
    localStorage.setItem('walletData', JSON.stringify(walletData));

    // Update admin transactions
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
  };

  const handleRejectDeposit = (transactionId: string) => {
    const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
    const updatedTransactions = adminTransactions.map((t: any) => 
      t.id === transactionId ? { ...t, status: 'failed', rejectedAt: new Date().toISOString() } : t
    );
    localStorage.setItem('adminTransactions', JSON.stringify(updatedTransactions));

    setTransactions(updatedTransactions);
    
    toast({
      title: "Deposit Rejected",
      description: "Deposit request has been rejected",
    });
  };

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
          <TabsList className="grid w-full grid-cols-5 bg-black/30 border border-purple-500/20">
            <TabsTrigger 
              value="deposits" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Deposits
            </TabsTrigger>
            <TabsTrigger 
              value="tournaments" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </TabsTrigger>
            <TabsTrigger 
              value="matches" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Matches
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deposits" className="space-y-6 mt-6">
            <Card className="bg-black/30 border-purple-500/20 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                  Pending Deposit Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-4 bg-black/40 rounded-lg border border-gray-700/50">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-semibold">{transaction.userName}</h3>
                          <span className="text-cyan-400 font-bold text-lg">₹{transaction.amount}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-1">{transaction.description}</p>
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
                          onClick={() => handleRejectDeposit(transaction.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                          size="sm"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length === 0 && (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400">No pending deposit approvals</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6 mt-6">
            <TournamentCreation />
          </TabsContent>

          <TabsContent value="matches" className="space-y-6 mt-6">
            <MatchResultsManagement />
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <Card className="bg-black/30 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Recent User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userActivity.slice().reverse().map((activity: any, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{activity.userName}</p>
                        <p className="text-gray-400 text-sm">{activity.action}: {activity.tournamentName}</p>
                        <p className="text-gray-500 text-xs">{new Date(activity.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        {activity.tournamentDetails && (
                          <div className="text-sm">
                            <p className="text-cyan-400">UID: {activity.tournamentDetails.uid}</p>
                            <p className="text-green-400">Fee: ₹{activity.tournamentDetails.entryFee}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {userActivity.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No user activity yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-black/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-cyan-400">{userActivity.length}</p>
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
                    {transactions.filter(t => t.status === 'completed').length}
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
