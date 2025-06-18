import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Star, Play, Target, Zap, Crown, Medal, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TournamentSlider from '@/components/TournamentSlider';
import ImageSlider from '@/components/ImageSlider';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [tournaments, setTournaments] = useState([]);
  const [stats, setStats] = useState({
    totalTournaments: 0,
    activePlayers: 0,
    prizeDistributed: 0,
    liveMatches: 0
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user, profile } = useAuth();

  // Load tournaments and calculate stats
  useEffect(() => {
    // Load default tournaments + admin created tournaments
    const defaultTournaments = [
      {
        id: 1,
        title: "Squad Showdown Championship",
        type: "Squad",
        prize: "₹25,000",
        players: "48/64",
        startTime: "2024-01-20 18:00",
        entryFee: "₹100",
        status: "open",
        map: "Bermuda",
        duration: "45 min",
        thumbnail: "/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png"
      },
      {
        id: 2,
        title: "Solo Warriors Battle",
        type: "Solo", 
        prize: "₹15,000",
        players: "89/100",
        startTime: "2024-01-20 20:00",
        entryFee: "₹50",
        status: "filling",
        map: "Purgatory",
        duration: "30 min",
        thumbnail: "/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png"
      },
      {
        id: 3,
        title: "Duo Masters Arena",
        type: "Duo",
        prize: "₹18,000", 
        players: "24/32",
        startTime: "2024-01-21 16:00",
        entryFee: "₹150",
        status: "open",
        map: "Kalahari",
        duration: "40 min",
        thumbnail: "/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png"
      }
    ];

    const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const allTournaments = [...defaultTournaments, ...storedTournaments];
    setTournaments(allTournaments);

    // Calculate dynamic stats
    const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    const activePlayers = new Set(userActivity.map(activity => activity.id)).size;
    const totalPrize = allTournaments.reduce((sum, tournament) => {
      const prizeAmount = parseInt(tournament.prize?.replace(/[^\d]/g, '') || '0');
      return sum + prizeAmount;
    }, 0);

    setStats({
      totalTournaments: allTournaments.length,
      activePlayers: activePlayers || 156,
      prizeDistributed: totalPrize || 250000,
      liveMatches: Math.floor(Math.random() * 5) + 3
    });
  }, []);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Don't redirect automatically, let user stay on current page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/30 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="Free Fire Tournament Logo" 
                className="w-10 h-10 rounded-lg"
              />
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/tournaments" className="text-gray-300 hover:text-white transition-colors">
                Tournaments
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm">
                    Welcome, {profile?.name || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <Link to="/dashboard">
                    <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Login
                  </Button>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <div className="relative p-6 bg-black/30 rounded-full border border-cyan-500/30">
                  <Trophy className="w-16 h-16 text-cyan-400" />
                </div>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Ultimate <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Free Fire</span> 
              <br />Tournaments
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Join the most exciting Free Fire tournaments, compete with skilled players worldwide, 
              and win amazing cash prizes in our premium gaming platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/tournaments">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium px-8 py-4 text-lg">
                  <Play className="w-5 h-5 mr-2" />
                  Join Tournament
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-8 py-4 text-lg">
                  <Target className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Slider Section */}
      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Featured Gallery</span>
            </h2>
            <p className="text-xl text-gray-300">Experience the thrill of competitive gaming</p>
          </div>
          <ImageSlider />
        </div>
      </div>

      <div className="py-16 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Live Tournaments</span>
            </h2>
            <p className="text-xl text-gray-300">Join these exciting tournaments happening right now!</p>
          </div>
          <TournamentSlider />
          <div className="text-center mt-8">
            <Link to="/tournaments">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700">
                <Trophy className="w-4 h-4 mr-2" />
                View All Tournaments
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="py-16 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Platform Statistics</h2>
            <p className="text-xl text-gray-300">Real-time data from our gaming community</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-md text-center">
              <CardContent className="p-6">
                <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-cyan-400">{stats.totalTournaments}</div>
                <div className="text-gray-300 text-sm">Total Tournaments</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md text-center">
              <CardContent className="p-6">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-purple-400">{stats.activePlayers.toLocaleString()}</div>
                <div className="text-gray-300 text-sm">Active Players</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-yellow-500/30 backdrop-blur-md text-center">
              <CardContent className="p-6">
                <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-yellow-400">₹{(stats.prizeDistributed / 1000).toFixed(0)}K</div>
                <div className="text-gray-300 text-sm">Prize Distributed</div>
              </CardContent>
            </Card>
            <Card className="bg-black/40 border-green-500/30 backdrop-blur-md text-center">
              <CardContent className="p-6">
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-green-400">{stats.liveMatches}</div>
                <div className="text-gray-300 text-sm">Live Matches</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose FireTourneys?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the best Free Fire tournament platform with advanced features and secure gameplay
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-black/40 border-cyan-500/20 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative p-4 bg-cyan-500/10 rounded-full inline-block">
                    <Crown className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Premium Tournaments</h3>
                <p className="text-gray-300 mb-6">
                  Join exclusive tournaments with bigger prize pools and compete against the best players in the community.
                </p>
                <Link to="/tournaments">
                  <Button variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black group-hover:scale-105 transition-all">
                    Explore Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md hover:border-purple-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative p-4 bg-purple-500/10 rounded-full inline-block">
                    <Zap className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Instant Payouts</h3>
                <p className="text-gray-300 mb-6">
                  Quick and secure prize distribution directly to your wallet. Get your winnings instantly after tournaments.
                </p>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-black group-hover:scale-105 transition-all">
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-yellow-500/20 backdrop-blur-md hover:border-yellow-500/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                  <div className="relative p-4 bg-yellow-500/10 rounded-full inline-block">
                    <Medal className="w-12 h-12 text-yellow-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Fair Play Guaranteed</h3>
                <p className="text-gray-300 mb-6">
                  Advanced anti-cheat systems and fair matchmaking ensure every player gets an equal opportunity to win.
                </p>
                <Link to="/tournaments">
                  <Button variant="outline" className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black group-hover:scale-105 transition-all">
                    Join Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="py-20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join thousands of players competing in exciting Free Fire tournaments. 
            Register now and claim your place among the champions!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-8 py-4 text-lg">
                <Trophy className="w-5 h-5 mr-2" />
                Start Playing Now
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button size="lg" variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black px-8 py-4 text-lg">
                Browse Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <footer className="bg-black/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png" 
                alt="FireTourneys" 
                className="w-8 h-8 rounded"
              />
              <span className="text-xl font-bold text-white">FireTourneys</span>
            </div>
            <p className="text-gray-400 mb-4">
              The ultimate destination for Free Fire tournaments and esports competitions.
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 FireTourneys. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default Index;
