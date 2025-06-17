import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock, Star, Filter, Search, MapPin, Calendar, Zap, Crown, Medal, Target, Gift, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TournamentJoinFlow from '@/components/TournamentJoinFlow';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';

const Tournaments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('prize');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [isJoinFlowOpen, setIsJoinFlowOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [tournaments, setTournaments] = useState([]);
  const { isAuthenticated } = useAuth();

  // Default tournaments + Admin created tournaments
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
    },
    {
      id: 4,
      title: "Elite Championship",
      type: "Squad",
      prize: "₹50,000",
      players: "12/16",
      startTime: "2024-01-22 19:00",
      entryFee: "₹500",
      status: "premium",
      map: "Bermuda",
      duration: "60 min",
      thumbnail: "/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png"
    },
    {
      id: 5,
      title: "Rookie Tournament",
      type: "Solo",
      prize: "₹5,000",
      players: "45/50",
      startTime: "2024-01-20 14:00",
      entryFee: "₹25",
      status: "open",
      map: "Purgatory",
      duration: "25 min",
      thumbnail: "/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png"
    },
    {
      id: 6,
      title: "Weekend Warriors",
      type: "Squad",
      prize: "₹35,000",
      players: "32/48",
      startTime: "2024-01-21 20:00",
      entryFee: "₹200",
      status: "open",
      map: "Kalahari",
      duration: "50 min",
      thumbnail: "/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png"
    }
  ];

  useEffect(() => {
    // Load tournaments from localStorage (admin created) and merge with defaults
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const allTournaments = [...defaultTournaments, ...storedTournaments.map(t => ({
      ...t,
      thumbnail: t.thumbnail || "/lovable-uploads/aa3dfb2a-24a0-4fbb-8a63-87e451fe6311.png"
    }))];
    setTournaments(allTournaments);
    
    console.log('Loaded tournaments:', allTournaments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'filling': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'premium': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Zap className="w-3 h-3" />;
      case 'filling': return <Clock className="w-3 h-3" />;
      case 'premium': return <Crown className="w-3 h-3" />;
      default: return <Target className="w-3 h-3" />;
    }
  };

  const getPrizeAmount = (prize: string) => {
    const numericValue = parseInt(prize.replace(/[^\d]/g, ''));
    return numericValue;
  };

  const sortedTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || tournament.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'prize':
        return getPrizeAmount(b.prize) - getPrizeAmount(a.prize);
      case 'players':
        const aPlayers = parseInt(a.players.split('/')[0]);
        const bPlayers = parseInt(b.players.split('/')[0]);
        return bPlayers - aPlayers;
      case 'time':
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      default:
        return 0;
    }
  });

  const handleJoinTournament = (tournament) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      setSelectedTournament(tournament);
      return;
    }
    setSelectedTournament(tournament);
    setIsJoinFlowOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (selectedTournament) {
      setIsJoinFlowOpen(true);
    }
  };

  const handleCloseJoinFlow = () => {
    setIsJoinFlowOpen(false);
    setSelectedTournament(null);
    
    // Refresh tournaments to show updated player counts
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const allTournaments = [...defaultTournaments, ...storedTournaments];
    setTournaments(allTournaments);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Navigation */}
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
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black">
                      Login
                    </Button>
                  </Link>
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

      {/* Enhanced Header with animated background */}
      <div className="relative py-20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative p-6 bg-black/30 rounded-full border border-cyan-500/30">
                  <Trophy className="w-16 h-16 text-cyan-400" />
                </div>
              </div>
            </div>
            <h1 className="text-6xl font-bold text-white mb-6">
              Live <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Tournaments</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join the ultimate Free Fire tournaments and compete for amazing prizes with players worldwide!
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Flame className="w-5 h-5" />
                <span>{tournaments.length} Live Tournaments</span>
              </div>
              <div className="flex items-center space-x-2 text-purple-400">
                <Gift className="w-5 h-5" />
                <span>₹{Math.floor(Math.random() * 500 + 100)}K+ Total Prizes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Enhanced Filters with better design */}
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-8 mb-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-black/30 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 rounded-xl h-12"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="bg-black/30 border-gray-600 text-white focus:border-cyan-500 rounded-xl h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="duo">Duo</SelectItem>
                <SelectItem value="squad">Squad</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-black/30 border-gray-600 text-white focus:border-cyan-500 rounded-xl h-12">
                <Medal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="prize">Prize Amount</SelectItem>
                <SelectItem value="players">Player Count</SelectItem>
                <SelectItem value="time">Start Time</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-center space-x-3 bg-black/30 rounded-xl px-4 py-3 border border-gray-600">
              <Trophy className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">{sortedTournaments.length} Tournaments</span>
            </div>
          </div>
        </div>

        {/* Enhanced Tournament Grid with better cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-black/40 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 group overflow-hidden hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20 rounded-2xl">
              {/* Tournament Thumbnail */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={tournament.thumbnail} 
                  alt={tournament.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tournament.status)} flex items-center space-x-1 backdrop-blur-md`}>
                    {getStatusIcon(tournament.status)}
                    <span>{tournament.status.toUpperCase()}</span>
                  </span>
                </div>

                {/* Tournament Type Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                    {tournament.type}
                  </span>
                </div>

                {/* Tournament Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">{tournament.title}</h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center text-purple-300">
                      <MapPin className="w-4 h-4 mr-1" />
                      {tournament.map}
                    </span>
                    <span className="flex items-center text-cyan-300">
                      <Clock className="w-4 h-4 mr-1" />
                      {tournament.duration}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Prize and Players */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold text-yellow-400">{tournament.prize}</span>
                      <p className="text-xs text-gray-400">Prize Pool</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-400 text-lg font-bold">
                      <Users className="w-5 h-5" />
                      <span>{tournament.players}</span>
                    </div>
                    <p className="text-xs text-gray-400">Players</p>
                  </div>
                </div>

                {/* Tournament Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(tournament.startTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(tournament.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm bg-black/30 rounded-lg p-3">
                    <span className="text-gray-300">
                      Entry Fee: <span className="text-cyan-400 font-bold">{tournament.entryFee}</span>
                    </span>
                    <span className="text-gray-300">
                      Duration: <span className="text-purple-400 font-bold">{tournament.duration}</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 rounded-xl"
                    onClick={() => handleJoinTournament(tournament)}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Join Tournament
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-all duration-300 rounded-xl px-4"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced No Results State */}
        {sortedTournaments.length === 0 && (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative p-8 bg-black/30 rounded-full border border-gray-700">
                <Search className="w-20 h-20 text-gray-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No tournaments found</h3>
            <p className="text-gray-400 mb-8 text-lg">Try adjusting your search or filter criteria</p>
            <Button onClick={() => {setSearchTerm(''); setFilterType('all');}} className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-8 py-3 text-lg rounded-xl">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Join Tournament Flow */}
      {selectedTournament && isAuthenticated && (
        <TournamentJoinFlow
          tournament={selectedTournament}
          isOpen={isJoinFlowOpen}
          onClose={handleCloseJoinFlow}
        />
      )}
    </div>
  );
};

export default Tournaments;
