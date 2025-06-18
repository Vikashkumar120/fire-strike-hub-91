
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, User, Bell, History, Wallet as WalletIcon, Settings, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '@/components/UserProfile';
import NotificationCenter from '@/components/NotificationCenter';
import MatchHistory from '@/components/MatchHistory';
import Wallet from '@/components/Wallet';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, profile, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/30 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="FireTourneys" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {profile.name || user.email?.split('@')[0]}</span>
              <Link to="/">
                <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-black"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {profile.name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-300 text-lg">
            Manage your tournaments, view your progress, and stay updated with notifications.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-cyan-400">
                {JSON.parse(localStorage.getItem('matchHistory') || '[]')
                  .filter(match => match.userId === user.id).length}
              </div>
              <div className="text-gray-300 text-sm">Tournaments Joined</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-green-500/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Trophy className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-400">
                {JSON.parse(localStorage.getItem('matchHistory') || '[]')
                  .filter(match => match.userId === user.id && match.result === 'winner').length}
              </div>
              <div className="text-gray-300 text-sm">Wins</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <Bell className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-400">
                {JSON.parse(localStorage.getItem('notifications') || '[]')
                  .filter(notif => notif.userId === user.id && !notif.read).length}
              </div>
              <div className="text-gray-300 text-sm">Unread Notifications</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-md">
            <CardContent className="p-6 text-center">
              <WalletIcon className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-yellow-400">₹0</div>
              <div className="text-gray-300 text-sm">Wallet Balance</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/30 border border-purple-500/20">
            <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center space-x-2 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center space-x-2 data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">
              <WalletIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="flex items-center space-x-2 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Tournaments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="history">
            <MatchHistory />
          </TabsContent>

          <TabsContent value="wallet">
            <Wallet />
          </TabsContent>

          <TabsContent value="tournaments">
            <Card className="bg-black/30 border-purple-500/20">
              <CardContent className="p-8 text-center">
                <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Explore Tournaments</h3>
                <p className="text-gray-300 mb-6">
                  Ready to join your next tournament? Browse all available tournaments and find the perfect match for your skill level.
                </p>
                <Link to="/tournaments">
                  <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                    <Trophy className="w-4 h-4 mr-2" />
                    Browse Tournaments
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
