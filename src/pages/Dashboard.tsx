
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Trophy, 
  Wallet as WalletIcon, 
  Calendar, 
  Settings, 
  Bell, 
  TrendingUp, 
  Users, 
  Star,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Camera,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Wallet from '@/components/Wallet';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [balance, setBalance] = useState(0);
  const [showWallet, setShowWallet] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [profileData, setProfileData] = useState({
    name: "ProGamer_21",
    uid: "FF123456789",
    email: "player@example.com",
    phone: "+91 9876543210"
  });
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect to tournaments if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/tournaments" replace />;
  }

  const userStats = {
    name: profileData.name,
    uid: profileData.uid,
    level: 45,
    walletBalance: balance,
    totalEarnings: 15680,
    tournamentsWon: 12,
    totalMatches: 47,
    winRate: 68,
    currentRank: 156
  };

  useEffect(() => {
    // Load wallet balance from localStorage
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[user?.id || ''] || { balance: 0, transactions: [] };
    setBalance(userWallet.balance);

    // Load profile data
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    if (savedProfile[user?.id || '']) {
      setProfileData(savedProfile[user?.id || '']);
    }

    // Load profile image
    const savedImage = localStorage.getItem(`profileImage_${user?.id || ''}`);
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, [user]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfileImage(imageUrl);
        localStorage.setItem(`profileImage_${user?.id || ''}`, imageUrl);
        toast({
          title: "Profile Image Updated!",
          description: "Your profile image has been saved successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = () => {
    const savedProfiles = JSON.parse(localStorage.getItem('userProfile') || '{}');
    savedProfiles[user?.id || ''] = profileData;
    localStorage.setItem('userProfile', JSON.stringify(savedProfiles));
    
    toast({
      title: "Profile Updated!",
      description: "Your profile has been saved successfully.",
    });
    setShowProfileEdit(false);
  };

  const recentMatches = [
    {
      id: 1,
      tournament: "Squad Championship",
      date: "2024-01-19",
      result: "1st Place",
      prize: "₹2,500",
      status: "won"
    },
    {
      id: 2,
      tournament: "Solo Warriors",
      date: "2024-01-18",
      result: "3rd Place",
      prize: "₹500",
      status: "won"
    },
    {
      id: 3,
      tournament: "Duo Masters",
      date: "2024-01-17",
      result: "6th Place",
      prize: "₹0",
      status: "lost"
    }
  ];

  const upcomingTournaments = [
    {
      id: 1,
      name: "Elite Championship",
      date: "2024-01-22 19:00",
      entryFee: "₹500",
      prize: "₹50,000"
    },
    {
      id: 2,
      name: "Weekend Warriors",
      date: "2024-01-21 20:00",
      entryFee: "₹200",
      prize: "₹35,000"
    }
  ];

  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: 2500,
      description: "Tournament Prize - Squad Championship",
      date: "2024-01-19",
      status: "completed"
    },
    {
      id: 2,
      type: "debit",
      amount: 500,
      description: "Tournament Entry - Elite Championship",
      date: "2024-01-18",
      status: "completed"
    },
    {
      id: 3,
      type: "credit",
      amount: 1000,
      description: "Wallet Top-up",
      date: "2024-01-17",
      status: "completed"
    }
  ];

  if (showWallet) {
    return <Wallet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/20 rounded-lg px-3 py-2">
                <WalletIcon className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-medium">₹{balance}</span>
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-cyan-500 to-purple-600"
                onClick={() => setShowWallet(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Money
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={profileImage} />
                <AvatarFallback className="bg-cyan-500 text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profileImage} />
              <AvatarFallback className="bg-cyan-500 text-white text-xl">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, <span className="text-cyan-400">{userStats.name}</span>
              </h1>
              <p className="text-gray-300">Ready to dominate the battlefield?</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              Level {userStats.level}
            </Badge>
            <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
              Rank #{userStats.currentRank}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/20 border border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Tournaments
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-black">
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/30 backdrop-blur-md border border-cyan-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-400">₹{userStats.totalEarnings}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Tournaments Won</p>
                      <p className="text-2xl font-bold text-yellow-400">{userStats.tournamentsWon}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-blue-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Win Rate</p>
                      <p className="text-2xl font-bold text-blue-400">{userStats.winRate}%</p>
                    </div>
                    <Star className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-pink-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Total Matches</p>
                      <p className="text-2xl font-bold text-pink-400">{userStats.totalMatches}</p>
                    </div>
                    <Users className="w-8 h-8 text-pink-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Matches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMatches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{match.tournament}</p>
                          <p className="text-gray-400 text-sm">{match.date}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${match.status === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                            {match.result}
                          </p>
                          <p className="text-cyan-400 text-sm">{match.prize}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Upcoming Tournaments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTournaments.map((tournament) => (
                      <div key={tournament.id} className="p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-medium">{tournament.name}</h4>
                          <Badge className="bg-cyan-500/20 text-cyan-300">{tournament.prize}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">{tournament.date}</span>
                          <span className="text-gray-300 text-sm">Entry: {tournament.entryFee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6 mt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Tournament Management</h2>
              <p className="text-gray-300 mb-6">Manage your tournament entries and view match history</p>
              <Link to="/tournaments">
                <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                  Browse Tournaments
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6 mt-6">
            <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Wallet Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">₹{balance}</div>
                  <p className="text-gray-300">Available Balance</p>
                </div>
                
                <div className="flex gap-4 justify-center mb-6">
                  <Button 
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                    onClick={() => setShowWallet(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Money
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300"
                    onClick={() => setShowWallet(true)}
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white font-medium">Recent Transactions</h3>
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {transaction.type === 'credit' ? (
                          <ArrowDownRight className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-400" />
                        )}
                        <div>
                          <p className="text-white text-sm">{transaction.description}</p>
                          <p className="text-gray-400 text-xs">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="bg-black/30 backdrop-blur-md border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {!showProfileEdit ? (
                  <div className="space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profileImage} />
                        <AvatarFallback className="bg-cyan-500 text-white text-2xl">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="profile-image-upload"
                        />
                        <label htmlFor="profile-image-upload">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 cursor-pointer"
                            asChild
                          >
                            <span>
                              <Camera className="w-4 h-4 mr-2" />
                              Change Photo
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 text-sm">Username</label>
                        <div className="text-white font-medium">{profileData.name}</div>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm">Free Fire UID</label>
                        <div className="text-white font-medium">{profileData.uid}</div>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm">Email</label>
                        <div className="text-white font-medium">{profileData.email}</div>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm">Phone</label>
                        <div className="text-white font-medium">{profileData.phone}</div>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm">Current Level</label>
                        <div className="text-cyan-400 font-medium">Level {userStats.level}</div>
                      </div>
                      <div>
                        <label className="text-gray-300 text-sm">Current Rank</label>
                        <div className="text-yellow-400 font-medium">#{userStats.currentRank}</div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button 
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                        onClick={() => setShowProfileEdit(true)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
                        <Input
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Free Fire UID</label>
                        <Input
                          value={profileData.uid}
                          onChange={(e) => setProfileData({...profileData, uid: e.target.value})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                        <Input
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                        <Input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="bg-black/20 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleProfileSave}
                        className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowProfileEdit(false)}
                        className="border-gray-600 text-gray-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
