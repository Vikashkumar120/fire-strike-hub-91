
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Trophy, MapPin, Clock, IndianRupee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TournamentJoinFlow from './TournamentJoinFlow';

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

interface TournamentCardProps {
  tournament: Tournament;
  onJoin?: () => void;
}

const TournamentCard = ({ tournament, onJoin }: TournamentCardProps) => {
  const [showJoinFlow, setShowJoinFlow] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to join tournaments",
        variant: "destructive"
      });
      return;
    }
    setShowJoinFlow(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-500/20 text-green-400';
      case 'full': return 'bg-yellow-500/20 text-yellow-400';
      case 'started': return 'bg-blue-500/20 text-blue-400';
      case 'completed': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-green-500/20 text-green-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card className="bg-black/40 border-purple-500/30 backdrop-blur-md hover:border-purple-500/50 transition-all group overflow-hidden">
        {tournament.thumbnail && (
          <div className="h-32 sm:h-40 overflow-hidden">
            <img 
              src={tournament.thumbnail} 
              alt={tournament.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-sm sm:text-lg truncate">
                {tournament.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                  {tournament.type}
                </Badge>
                <Badge className={`text-xs ${getStatusColor(tournament.status)}`}>
                  {tournament.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 text-gray-300">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              <span className="truncate">{tournament.prize}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-300">
              <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
              <span>₹{tournament.entry_fee}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-300">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span>{tournament.current_players}/{tournament.max_players}</span>
            </div>
            
            <div className="flex items-center space-x-1 text-gray-300">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="truncate text-xs">{formatDate(tournament.start_time)}</span>
            </div>
          </div>

          {tournament.map && (
            <div className="flex items-center space-x-1 text-gray-300 text-xs sm:text-sm">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
              <span>{tournament.map}</span>
              {tournament.duration && (
                <>
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 ml-2" />
                  <span>{tournament.duration}</span>
                </>
              )}
            </div>
          )}

          <Button 
            onClick={handleJoinClick}
            disabled={tournament.status !== 'open' || tournament.current_players >= tournament.max_players}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-sm sm:text-base h-9 sm:h-10"
          >
            {tournament.status === 'open' && tournament.current_players < tournament.max_players
              ? 'Join Tournament'
              : tournament.status === 'full' || tournament.current_players >= tournament.max_players
              ? 'Tournament Full'
              : 'Tournament Closed'
            }
          </Button>
        </CardContent>
      </Card>

      {showJoinFlow && (
        <TournamentJoinFlow
          tournament={{
            id: parseInt(tournament.id),
            title: tournament.title,
            type: tournament.type,
            entryFee: tournament.entry_fee,
            prizePool: parseInt(tournament.prize.replace(/[₹,]/g, '')) || 0,
            slots: { filled: tournament.current_players, total: tournament.max_players },
            date: tournament.start_time,
            map: tournament.map || '',
            startTime: tournament.start_time,
            prize: tournament.prize
          }}
          isOpen={showJoinFlow}
          onClose={() => {
            setShowJoinFlow(false);
            onJoin?.();
          }}
        />
      )}
    </>
  );
};

export default TournamentCard;
