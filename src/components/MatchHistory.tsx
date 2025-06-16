
import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Users, MapPin, Upload, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ResultScreenshotUpload from './ResultScreenshotUpload';

const MatchHistory = () => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [uploadingMatch, setUploadingMatch] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    setMatchHistory(history);
  }, []);

  const getResultBadge = (result) => {
    if (result === 'winner') {
      return <Badge className="bg-green-500/20 text-green-400">🏆 WON!</Badge>;
    } else if (result === 'loss') {
      return <Badge className="bg-red-500/20 text-red-400">❌ LOST</Badge>;
    }
    return <Badge className="bg-yellow-500/20 text-yellow-400">⏳ PENDING</Badge>;
  };

  const handleScreenshotUpload = (matchId, screenshotData) => {
    const updatedHistory = matchHistory.map(match => {
      if (match.id === matchId) {
        return { ...match, resultScreenshot: screenshotData };
      }
      return match;
    });
    setMatchHistory(updatedHistory);
    setUploadingMatch(null);
  };

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
              <div className="flex flex-col items-end space-y-2">
                {getResultBadge(match.result)}
                {match.result === 'winner' && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Prize: {match.tournament.prize}</span>
                  </div>
                )}
              </div>
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

              {match.result && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-gray-300 text-sm">Result Status: 
                    <span className={`ml-2 font-medium ${
                      match.result === 'winner' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {match.result === 'winner' ? 'You Won!' : 'You Lost'}
                    </span>
                  </p>
                  {match.resultMarkedAt && (
                    <p className="text-gray-400 text-xs mt-1">
                      Result declared: {new Date(match.resultMarkedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Screenshot Section */}
            <div className="mt-4">
              {match.resultScreenshot ? (
                <div>
                  <p className="text-gray-300 text-sm mb-2">Result Screenshot:</p>
                  <img 
                    src={match.resultScreenshot} 
                    alt="Result Screenshot" 
                    className="max-w-48 h-32 rounded-lg border border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => window.open(match.resultScreenshot, '_blank')}
                  />
                </div>
              ) : (
                <div>
                  {uploadingMatch === match.id ? (
                    <ResultScreenshotUpload
                      matchId={match.id}
                      onUploadComplete={(screenshot) => handleScreenshotUpload(match.id, screenshot)}
                    />
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setUploadingMatch(match.id)}
                      className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Result Screenshot
                    </Button>
                  )}
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
