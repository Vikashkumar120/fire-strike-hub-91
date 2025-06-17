
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TournamentCard from '@/components/TournamentCard';

interface Tournament {
  id: string;
  title: string;
  type: string;
  prize: string;
  entry_fee: number;
  max_players: number;
  current_players: number;
  start_time: string;
  status: string;
  map?: string;
  duration?: string;
  thumbnail?: string;
}

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    filterTournaments();
  }, [tournaments, searchTerm, typeFilter, statusFilter]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching tournaments:', error);
        toast({
          title: "Error",
          description: "Failed to load tournaments",
          variant: "destructive"
        });
        return;
      }

      setTournaments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTournaments = () => {
    let filtered = tournaments;

    if (searchTerm) {
      filtered = filtered.filter(tournament =>
        tournament.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(tournament => tournament.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tournament => tournament.status === statusFilter);
    }

    setFilteredTournaments(filtered);
  };

  const handleTournamentJoin = () => {
    // Refresh tournaments after joining
    fetchTournaments();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Tournaments</h1>
          </div>
          
          {isAdmin && (
            <Button
              onClick={() => navigate('/admin')}
              size="sm"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Create</span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 h-12"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-black/20 border-gray-600 text-white h-12">
                <SelectValue placeholder="Tournament Type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-gray-600">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Solo">Solo</SelectItem>
                <SelectItem value="Duo">Duo</SelectItem>
                <SelectItem value="Squad">Squad</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-black/20 border-gray-600 text-white h-12">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-gray-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="started">Started</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tournament Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-black/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onJoin={handleTournamentJoin}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {tournaments.length === 0 ? 'No tournaments available' : 'No tournaments match your filters'}
            </div>
            <Button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tournaments;
