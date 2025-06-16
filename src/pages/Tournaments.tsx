import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Clock, Star, Filter, Search } from 'lucide-react';
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
      duration: "45 min"
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
      duration: "30 min"
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
      duration: "40 min"
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
      duration: "60 min"
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
      duration: "25 min"
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
      duration: "50 min"
    }
  ];

  useEffect(() => {
    // Load tournaments from localStorage (admin created) and merge with defaults
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const allTournaments = [...defaultTournaments, ...storedTournaments];
    setTournaments(allTournaments);
    
    console.log('Loaded tournaments:', allTournaments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-green-400 bg-green-400/10';
      case 'filling': return 'text-yellow-400 bg-yellow-400/10';
      case 'premium': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || tournament.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
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
        duration: "45 min"
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
        duration: "30 min"
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
        duration: "40 min"
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
        duration: "60 min"
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
        duration: "25 min"
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
        duration: "50 min"
      }
    ];
    const allTournaments = [...defaultTournaments, ...storedTournaments];
    setTournaments(allTournaments);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 bg-black/20 backdrop-blur-md border-b border-cyan-500/20">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Live <span className="text-cyan-400">Tournaments</span>
          </h1>
          <p className="text-gray-300 text-lg">Join the competition and win amazing prizes!</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48 bg-black/20 border-gray-600 text-white">
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
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <Card key={tournament.id} className="bg-black/30 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group overflow-hidden">
              <div className="h-40 bg-gradient-to-r from-purple-600 to-cyan-500 relative">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                    {tournament.status.toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4">
                  <h3 className="text-white font-bold text-lg mb-1">{tournament.title}</h3>
                  <span className="text-cyan-300 text-sm">{tournament.type} • {tournament.map}</span>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-cyan-400">{tournament.prize}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-400">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{tournament.players}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(tournament.startTime).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">Entry Fee: <span className="text-white font-medium">{tournament.entryFee}</span></span>
                    <span className="text-gray-300">Duration: <span className="text-white">{tournament.duration}</span></span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                    onClick={() => handleJoinTournament(tournament)}
                  >
                    Join Tournament
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No tournaments found</div>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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
