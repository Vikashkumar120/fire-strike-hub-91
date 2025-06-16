
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Upload, 
  Eye,
  Award,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const MatchResultsManagement = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = () => {
    // Load match data from localStorage
    const storedMatches = JSON.parse(localStorage.getItem('matchResults') || '[]');
    const matchHistory = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    
    // Combine tournament data with join history
    const enhancedMatches = storedMatches.map(match => {
      const joinedUsers = matchHistory.filter(history => 
        history.tournament.id === match.tournamentId
      );
      
      return {
        ...match,
        joinedUsers,
        totalUsers: joinedUsers.length
      };
    });
    
    setMatches(enhancedMatches);
  };

  const markResult = (matchId, userId, result) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        const updatedUsers = match.joinedUsers.map(user => {
          if (user.id === userId) {
            return { ...user, result, resultMarkedAt: new Date().toISOString() };
          }
          return user;
        });
        
        return { ...match, joinedUsers: updatedUsers };
      }
      return match;
    });
    
    setMatches(updatedMatches);
    localStorage.setItem('matchResults', JSON.stringify(updatedMatches));
    
    // Update user's match history
    const matchHistory = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    const updatedHistory = matchHistory.map(history => {
      if (history.tournament.id === matchId && history.id === userId) {
        return { ...history, result, resultMarkedAt: new Date().toISOString() };
      }
      return history;
    });
    localStorage.setItem('matchHistory', JSON.stringify(updatedHistory));
    
    toast({
      title: "Result Updated",
      description: `Player marked as ${result}`,
    });
  };

  const viewScreenshot = (screenshot) => {
    if (screenshot) {
      window.open(screenshot, '_blank');
    }
  };

  const getResultBadge = (result) => {
    if (result === 'winner') {
      return <Badge className="bg-green-500/20 text-green-400">WINNER</Badge>;
    } else if (result === 'loss') {
      return <Badge className="bg-red-500/20 text-red-400">LOSS</Badge>;
    }
    return <Badge className="bg-yellow-500/20 text-yellow-400">PENDING</Badge>;
  };

  if (selectedMatch) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedMatch(null)}
            className="border-gray-600 text-gray-300"
          >
            ← Back to Matches
          </Button>
          <h2 className="text-2xl font-bold text-white">{selectedMatch.matchName}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-gray-300 text-sm">Total Joined</p>
                  <p className="text-white text-xl font-bold">{selectedMatch.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-gray-300 text-sm">Winners</p>
                  <p className="text-white text-xl font-bold">
                    {selectedMatch.joinedUsers.filter(u => u.result === 'winner').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-gray-300 text-sm">Status</p>
                  <p className="text-white text-xl font-bold">
                    {selectedMatch.joinedUsers.every(u => u.result) ? 'Complete' : 'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/30 border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white">Registered Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedMatch.joinedUsers.map((user) => (
                <div key={user.id} className="bg-black/20 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-300 text-sm">Player Details</p>
                          <p className="text-white font-medium">{user.gameDetails?.gameName || 'N/A'}</p>
                          <p className="text-cyan-400 text-sm">UID: {user.gameDetails?.uid || 'N/A'}</p>
                          <p className="text-gray-400 text-sm">WhatsApp: {user.gameDetails?.whatsappNumber || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-300 text-sm">Joined On</p>
                          <p className="text-white">{new Date(user.joinedAt).toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">Slot: #{user.slotNumber}</p>
                        </div>

                        <div>
                          <p className="text-gray-300 text-sm">Payment</p>
                          <p className="text-green-400">₹{user.tournament.entryFee}</p>
                          {user.paymentData && (
                            <p className="text-gray-400 text-xs">ID: {user.paymentData.transactionId}</p>
                          )}
                        </div>
                      </div>

                      {user.resultScreenshot && (
                        <div className="mt-3">
                          <p className="text-gray-300 text-sm mb-2">Result Screenshot:</p>
                          <img 
                            src={user.resultScreenshot} 
                            alt="Result Screenshot" 
                            className="max-w-32 h-24 rounded-lg border border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => viewScreenshot(user.resultScreenshot)}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end space-y-2 ml-4">
                      {getResultBadge(user.result)}
                      
                      {!user.result && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => markResult(selectedMatch.id, user.id, 'winner')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Winner
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markResult(selectedMatch.id, user.id, 'loss')}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Loss
                          </Button>
                        </div>
                      )}

                      {user.result && (
                        <p className="text-gray-400 text-xs">
                          Marked: {new Date(user.resultMarkedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {selectedMatch.joinedUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 text-lg">No players joined this match yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Match Results Management</h2>
      
      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="bg-black/30 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer">
            <CardContent className="p-4" onClick={() => setSelectedMatch(match)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <div>
                      <h3 className="text-white font-bold text-lg">{match.matchName}</h3>
                      <p className="text-cyan-400 text-sm">{match.tournamentType} • {match.map}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <div>
                        <p className="text-gray-300">Players</p>
                        <p className="text-white font-medium">{match.totalUsers}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-green-400" />
                      <div>
                        <p className="text-gray-300">Winners</p>
                        <p className="text-white font-medium">
                          {match.joinedUsers.filter(u => u.result === 'winner').length}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <div>
                        <p className="text-gray-300">Date</p>
                        <p className="text-white font-medium">
                          {new Date(match.startTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-gray-300">Prize</p>
                        <p className="text-white font-medium">₹{match.prizePool}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Badge className={
                    match.joinedUsers.length > 0 && match.joinedUsers.every(u => u.result) 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }>
                    {match.joinedUsers.length > 0 && match.joinedUsers.every(u => u.result) ? 'COMPLETE' : 'PENDING'}
                  </Badge>
                  
                  <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600">
                    <Eye className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {matches.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 text-lg">No matches to manage yet</p>
            <p className="text-gray-500">Matches will appear here once users join tournaments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchResultsManagement;
