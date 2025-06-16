
import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MatchHistory = () => {
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    setMatchHistory(history);
  }, []);

  if (matchHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">No matches joined yet</div>
        <p className="text-gray-500">Join a tournament to see your match history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">My Match History</h2>
      
      {matchHistory.map((match) => (
        <Card key={match.id} className="bg-black/30 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-white font-bold text-lg">{match.tournament.title}</h3>
                <p className="text-cyan-400 text-sm">{match.tournament.type} Tournament</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">
                Joined
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-gray-300 text-xs">Match Time</p>
                  <p className="text-white text-sm">{new Date(match.tournament.startTime).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <div>
                  <p className="text-gray-300 text-xs">Prize Pool</p>
                  <p className="text-white text-sm">{match.tournament.prize}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-gray-300 text-xs">Map</p>
                  <p className="text-white text-sm">{match.tournament.map}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-gray-300 text-xs">Slot Number</p>
                  <p className="text-white text-sm">#{match.slotNumber}</p>
                </div>
              </div>
            </div>

            <div className="bg-black/20 p-3 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-300">Game Name:</p>
                  <p className="text-cyan-400">{match.gameDetails.gameName}</p>
                </div>
                <div>
                  <p className="text-gray-300">UID:</p>
                  <p className="text-cyan-400">{match.gameDetails.uid}</p>
                </div>
                <div>
                  <p className="text-gray-300">WhatsApp:</p>
                  <p className="text-cyan-400">{match.gameDetails.whatsappNumber}</p>
                </div>
              </div>
              
              {match.paymentData && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-gray-300 text-sm">Transaction ID: 
                    <span className="text-green-400 font-mono ml-2">{match.paymentData.transactionId}</span>
                  </p>
                </div>
              )}
            </div>

            <p className="text-gray-400 text-xs mt-3">
              Joined on: {new Date(match.joinedAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MatchHistory;
