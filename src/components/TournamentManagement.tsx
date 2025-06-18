
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Search, Calendar, Users, Trophy, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  custom_code?: string;
  thumbnail?: string;
}

const TournamentManagement = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  
  const { toast } = useToast();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchTournaments();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterTournaments();
  }, [tournaments, searchTerm, statusFilter]);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });

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
        tournament.custom_code?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(tournament => tournament.status === statusFilter);
    }

    setFilteredTournaments(filtered);
  };

  const handleDelete = async (tournamentId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', tournamentId);

      if (error) {
        console.error('Error deleting tournament:', error);
        toast({
          title: "Delete Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Tournament Deleted",
        description: `${title} has been deleted successfully.`
      });

      fetchTournaments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete tournament",
        variant: "destructive"
      });
    }
  };

  const handleStatusUpdate = async (tournamentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({ status: newStatus })
        .eq('id', tournamentId);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Status Updated",
        description: `Tournament status changed to ${newStatus}.`
      });

      fetchTournaments();
    } catch (error) {
      console.error('Status update error:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <Card className="bg-black/30 border-red-500/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-white text-xl mb-4">Access Denied</h3>
          <p className="text-gray-300">Only administrators can manage tournaments.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white text-2xl flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          Tournament Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-gray-600 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-black/20 border-gray-600 text-white">
              <SelectValue placeholder="Filter by status" />
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

        {/* Tournament List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-black/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredTournaments.map((tournament) => (
              <div key={tournament.id} className="bg-black/40 rounded-lg p-4 border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">{tournament.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                      <div className="text-gray-300">
                        <span className="text-gray-500">Type:</span> {tournament.type}
                      </div>
                      <div className="text-green-400">
                        <span className="text-gray-500">Prize:</span> {tournament.prize}
                      </div>
                      <div className="text-blue-400">
                        <span className="text-gray-500">Players:</span> {tournament.current_players}/{tournament.max_players}
                      </div>
                      <div className="text-purple-400">
                        <span className="text-gray-500">Fee:</span> ₹{tournament.entry_fee}
                      </div>
                    </div>
                    {tournament.custom_code && (
                      <div className="mt-2 flex items-center">
                        <Code className="w-4 h-4 mr-1 text-yellow-400" />
                        <span className="text-yellow-400 font-mono text-sm">{tournament.custom_code}</span>
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(tournament.start_time).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Select
                      value={tournament.status}
                      onValueChange={(value) => handleStatusUpdate(tournament.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs bg-black/20 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-gray-600">
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="started">Started</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      onClick={() => handleDelete(tournament.id, tournament.title)}
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No tournaments found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentManagement;
