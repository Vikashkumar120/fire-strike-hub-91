
import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  DollarSign, 
  Calendar, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 2847,
    activeTournaments: 12,
    totalRevenue: 245680,
    pendingWithdrawals: 8,
    todayRegistrations: 45,
    monthlyGrowth: 15.2
  };

  const tournaments = [
    {
      id: 1,
      name: "Squad Championship",
      type: "Squad",
      players: "48/64",
      prizePool: 25000,
      entryFee: 100,
      status: "active",
      startDate: "2024-01-20 18:00"
    },
    {
      id: 2,
      name: "Solo Warriors",
      type: "Solo",
      players: "89/100",
      prizePool: 15000,
      entryFee: 50,
      status: "filling",
      startDate: "2024-01-20 20:00"
    },
    {
      id: 3,
      name: "Elite Championship",
      type: "Squad",
      players: "12/16",
      prizePool: 50000,
      entryFee: 500,
      status: "upcoming",
      startDate: "2024-01-22 19:00"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      username: "ProGamer_21",
      email: "gamer21@email.com",
      joinDate: "2024-01-19",
      status: "active",
      matches: 12,
      winnings: 5500
    },
    {
      id: 2,
      username: "FireKing99",
      email: "fireking@email.com",
      joinDate: "2024-01-19",
      status: "active",
      matches: 8,
      winnings: 2300
    },
    {
      id: 3,
      username: "EliteShooter",
      email: "elite@email.com",
      joinDate: "2024-01-18",
      status: "suspended",
      matches: 15,
      winnings: 0
    }
  ];

  const withdrawalRequests = [
    {
      id: 1,
      username: "ProGamer_21",
      amount: 2500,
      method: "UPI",
      requestDate: "2024-01-19",
      status: "pending"
    },
    {
      id: 2,
      username: "FireKing99",
      amount: 1800,
      method: "Bank Transfer",
      requestDate: "2024-01-19",
      status: "pending"
    },
    {
      id: 3,
      username: "EliteShooter",
      amount: 3200,
      method: "PayPal",
      requestDate: "2024-01-18",
      status: "approved"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      case 'approved': return 'bg-blue-500/20 text-blue-400';
      case 'filling': return 'bg-orange-500/20 text-orange-400';
      case 'upcoming': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                Admin
              </Badge>
              <Button variant="outline" size="sm" className="border-gray-600">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin <span className="text-cyan-400">Dashboard</span>
          </h1>
          <p className="text-gray-300">Manage tournaments, users, and platform operations</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Users
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/30 backdrop-blur-md border border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-cyan-400">{stats.totalUsers}</p>
                      <p className="text-green-400 text-xs">+{stats.todayRegistrations} today</p>
                    </div>
                    <Users className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Active Tournaments</p>
                      <p className="text-2xl font-bold text-purple-400">{stats.activeTournaments}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-400">₹{stats.totalRevenue}</p>
                      <p className="text-green-400 text-xs">+{stats.monthlyGrowth}% this month</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-yellow-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Pending Withdrawals</p>
                      <p className="text-2xl font-bold text-yellow-400">{stats.pendingWithdrawals}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Recent Tournaments
                    <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600">
                      <Plus className="w-4 h-4 mr-1" />
                      New
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tournaments.slice(0, 3).map((tournament) => (
                      <div key={tournament.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{tournament.name}</p>
                          <p className="text-gray-400 text-sm">{tournament.players} players</p>
                        </div>
                        <Badge className={getStatusColor(tournament.status)}>
                          {tournament.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{user.username}</p>
                          <p className="text-gray-400 text-sm">Joined {user.joinDate}</p>
                        </div>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Tournament Management</h2>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Tournament
              </Button>
            </div>

            <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Tournament</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Players</TableHead>
                      <TableHead className="text-gray-300">Prize Pool</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tournaments.map((tournament) => (
                      <TableRow key={tournament.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{tournament.name}</TableCell>
                        <TableCell className="text-gray-300">{tournament.type}</TableCell>
                        <TableCell className="text-gray-300">{tournament.players}</TableCell>
                        <TableCell className="text-green-400">₹{tournament.prizePool}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(tournament.status)}>
                            {tournament.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline" className="border-gray-600">
                  Export Users
                </Button>
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600">
                  Send Notification
                </Button>
              </div>
            </div>

            <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Username</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Join Date</TableHead>
                      <TableHead className="text-gray-300">Matches</TableHead>
                      <TableHead className="text-gray-300">Winnings</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{user.username}</TableCell>
                        <TableCell className="text-gray-300">{user.email}</TableCell>
                        <TableCell className="text-gray-300">{user.joinDate}</TableCell>
                        <TableCell className="text-gray-300">{user.matches}</TableCell>
                        <TableCell className="text-green-400">₹{user.winnings}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Withdrawal Management</h2>
              <Badge className="bg-yellow-500/20 text-yellow-300">
                {stats.pendingWithdrawals} Pending
              </Badge>
            </div>

            <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Username</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Method</TableHead>
                      <TableHead className="text-gray-300">Request Date</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalRequests.map((request) => (
                      <TableRow key={request.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{request.username}</TableCell>
                        <TableCell className="text-green-400 font-medium">₹{request.amount}</TableCell>
                        <TableCell className="text-gray-300">{request.method}</TableCell>
                        <TableCell className="text-gray-300">{request.requestDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {request.status === 'pending' && (
                              <>
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-600 text-red-400">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="outline" className="border-gray-600">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <h2 className="text-2xl font-bold text-white">Platform Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Minimum Withdrawal Amount</label>
                    <div className="text-white font-medium">₹100</div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Transaction Fee</label>
                    <div className="text-white font-medium">2.5%</div>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600">
                    Update Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Tournament Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Default Tournament Duration</label>
                    <div className="text-white font-medium">45 minutes</div>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Max Players per Tournament</label>
                    <div className="text-white font-medium">100</div>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600">
                    Update Settings
                  </Button>
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
