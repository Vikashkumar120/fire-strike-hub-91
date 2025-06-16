
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Trophy, 
  IndianRupee, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  CheckCircle,
  XCircle,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      title: "Squad Showdown Championship",
      type: "Squad",
      entryFee: 100,
      prizePool: 25000,
      slots: { filled: 48, total: 64 },
      status: "active",
      date: "2024-01-20T18:00"
    },
    {
      id: 2,
      title: "Solo Warriors Battle",
      type: "Solo", 
      entryFee: 50,
      prizePool: 15000,
      slots: { filled: 89, total: 100 },
      status: "active",
      date: "2024-01-20T20:00"
    }
  ]);

  const [withdrawals] = useState([
    { id: 1, user: "Player123", amount: 500, upi: "player@paytm", status: "pending", date: "2024-01-15" },
    { id: 2, user: "Gamer456", amount: 250, upi: "gamer@phonepe", status: "approved", date: "2024-01-14" }
  ]);

  const { toast } = useToast();

  const handleCreateTournament = () => {
    toast({
      title: "Tournament Creation",
      description: "Tournament creation form would open here",
    });
  };

  const handleEditTournament = (id: number) => {
    toast({
      title: "Edit Tournament",
      description: `Editing tournament ${id}`,
    });
  };

  const handleDeleteTournament = (id: number) => {
    setTournaments(tournaments.filter(t => t.id !== id));
    toast({
      title: "Tournament Deleted",
      description: "Tournament has been removed successfully",
    });
  };

  const handleWithdrawalAction = (id: number, action: 'approve' | 'reject') => {
    toast({
      title: action === 'approve' ? "Withdrawal Approved" : "Withdrawal Rejected",
      description: `Withdrawal request ${id} has been ${action}d`,
    });
  };

  const sendNotification = () => {
    toast({
      title: "Notification Sent",
      description: "Push notification sent to all users",
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/30 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
            <Users className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2,847</div>
            <p className="text-xs text-green-400">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-green-400">+3 new this week</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹1,24,580</div>
            <p className="text-xs text-green-400">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Withdrawals</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹8,450</div>
            <p className="text-xs text-orange-400">5 requests pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div>
                <p className="text-white font-medium">New tournament created</p>
                <p className="text-gray-400 text-sm">Squad Championship - ₹50,000 prize pool</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">New</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div>
                <p className="text-white font-medium">Payment received</p>
                <p className="text-gray-400 text-sm">Player123 - ₹100 entry fee</p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-400">Payment</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
              <div>
                <p className="text-white font-medium">Withdrawal approved</p>
                <p className="text-gray-400 text-sm">Gamer456 - ₹250 to UPI</p>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400">Withdrawal</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTournaments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Tournament Management</h2>
        <Button onClick={handleCreateTournament} className="bg-gradient-to-r from-cyan-500 to-purple-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      <div className="grid gap-4">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{tournament.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-300">Type: <span className="text-cyan-400">{tournament.type}</span></span>
                    <span className="text-gray-300">Entry: <span className="text-green-400">₹{tournament.entryFee}</span></span>
                    <span className="text-gray-300">Prize: <span className="text-yellow-400">₹{tournament.prizePool}</span></span>
                  </div>
                  <div className="flex gap-4 mt-2 text-sm">
                    <span className="text-gray-300">Slots: <span className="text-purple-400">{tournament.slots.filled}/{tournament.slots.total}</span></span>
                    <span className="text-gray-300">Date: <span className="text-orange-400">{new Date(tournament.date).toLocaleString()}</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditTournament(tournament.id)} className="border-gray-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteTournament(tournament.id)} className="border-red-600 text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWithdrawals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Withdrawal Management</h2>
      
      <div className="grid gap-4">
        {withdrawals.map((withdrawal) => (
          <Card key={withdrawal.id} className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium">{withdrawal.user}</h3>
                  <p className="text-gray-300 text-sm">Amount: ₹{withdrawal.amount}</p>
                  <p className="text-gray-300 text-sm">UPI: {withdrawal.upi}</p>
                  <p className="text-gray-400 text-xs">Date: {withdrawal.date}</p>
                </div>
                <div className="flex gap-2">
                  {withdrawal.status === 'pending' ? (
                    <>
                      <Button 
                        size="sm" 
                        onClick={() => handleWithdrawalAction(withdrawal.id, 'approve')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleWithdrawalAction(withdrawal.id, 'reject')}
                        className="border-red-600 text-red-400"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Badge className={withdrawal.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                      {withdrawal.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Push Notifications</h2>
      
      <Card className="bg-black/30 border-purple-500/20">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Notification Title
              </label>
              <Input
                placeholder="Enter notification title"
                className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Message
              </label>
              <Input
                placeholder="Enter notification message"
                className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button onClick={sendNotification} className="bg-gradient-to-r from-cyan-500 to-purple-600">
              <Bell className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="Free Fire Tournament Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-white">FireTourneys Admin</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Link to="/">
                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-black/20 p-1 rounded-lg">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'tournaments', label: 'Tournaments' },
            { id: 'withdrawals', label: 'Withdrawals' },
            { id: 'notifications', label: 'Notifications' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-black/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'tournaments' && renderTournaments()}
        {activeTab === 'withdrawals' && renderWithdrawals()}
        {activeTab === 'notifications' && renderNotifications()}
      </div>
    </div>
  );
};

export default AdminDashboard;
