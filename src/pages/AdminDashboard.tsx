
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, Trophy, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import MatchResultsManagement from '@/components/MatchResultsManagement';

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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/30">
          <TabsTrigger value="deposits" className="data-[state=active]:bg-purple-600">
            Deposit Approvals
          </TabsTrigger>
          <TabsTrigger value="matches" className="data-[state=active]:bg-purple-600">
            Match Management
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
            User Activity
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-purple-600">
            Statistics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits" className="space-y-4">
          <Card className="bg-black/30 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Pending Deposit Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{transaction.userName} - {transaction.description}</p>
                      <p className="text-gray-400 text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                      <p className="text-cyan-400 text-sm">Amount: ₹{transaction.amount}</p>
                      {transaction.screenshot && (
                        <a href={transaction.screenshot} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs">View Screenshot</a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleApproveDeposit(transaction.id, transaction.userId!, transaction.amount)}
                        className="bg-green-600 hover:bg-green-700 size-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        onClick={() => handleRejectDeposit(transaction.id)}
                        className="bg-red-600 hover:bg-red-700 size-sm"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length === 0 && (
                  <p className="text-gray-400 text-center py-4">No pending deposit approvals</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <MatchResultsManagement />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
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

        <TabsContent value="stats" className="space-y-4">
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
  );
};

export default AdminDashboard;
