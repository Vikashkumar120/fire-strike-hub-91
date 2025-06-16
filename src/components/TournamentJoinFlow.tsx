import React, { useState } from 'react';
import { X, Trophy, Users, Clock, MapPin, CheckCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import UPIPayment from './UPIPayment';
import LoginModal from './LoginModal';

interface Tournament {
  id: number;
  title: string;
  type: string;
  prize: string;
  players: string;
  startTime: string;
  entryFee: string;
  map: string;
  duration: string;
}

interface TournamentJoinFlowProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const TournamentJoinFlow = ({ tournament, isOpen, onClose, isMobile = false }: TournamentJoinFlowProps) => {
  const [step, setStep] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [gameDetails, setGameDetails] = useState({
    gameName: '',
    uid: '',
    whatsappNumber: '',
    squadMembers: ['', '', '']
  });
  const [paymentData, setPaymentData] = useState({
    transactionId: '',
    amount: 0
  });
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  const entryFeeAmount = parseInt(tournament.entryFee.replace('₹', '')) || 0;
  const isFree = entryFeeAmount === 0;

  const handleJoinClick = () => {
    if (!isAuthenticated) {
      // Show authentication required message
      toast({
        title: "Authentication Required",
        description: "Please sign up or login to join tournaments",
        variant: "destructive"
      });
      setShowLoginModal(true);
      return;
    }
    setStep(2);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    setStep(2);
    toast({
      title: "Welcome!",
      description: "You can now proceed to join the tournament",
    });
  };

  const handleGameDetailsSubmit = () => {
    if (!gameDetails.gameName || !gameDetails.uid || !gameDetails.whatsappNumber) {
      toast({
        title: "Required Fields Missing",
        description: "Please enter your Game Name, UID, and WhatsApp Number",
        variant: "destructive"
      });
      return;
    }
    
    if (isFree) {
      handleJoinComplete();
    } else {
      setStep(3);
    }
  };

  const handlePaymentSuccess = (transactionId: string) => {
    setPaymentData({
      transactionId,
      amount: entryFeeAmount
    });
    handleJoinComplete();
  };

  const handleJoinComplete = () => {
    const slotNumber = Math.floor(Math.random() * 64) + 1;
    
    // Store match history
    const matchHistory = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    const newMatch = {
      id: Date.now(),
      tournament,
      gameDetails,
      paymentData: isFree ? null : paymentData,
      joinedAt: new Date().toISOString(),
      userId: user?.id,
      slotNumber: slotNumber
    };
    matchHistory.push(newMatch);
    localStorage.setItem('matchHistory', JSON.stringify(matchHistory));

    // Store user activity for admin
    const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    userActivity.push({
      userId: user?.id,
      userName: user?.name,
      userEmail: user?.email,
      action: 'joined_tournament',
      tournamentId: tournament.id,
      tournamentName: tournament.title,
      slotNumber: slotNumber,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('userActivity', JSON.stringify(userActivity));

    // Update tournament slots
    const tournamentData = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const updatedTournaments = tournamentData.map((t: any) => {
      if (t.id === tournament.id) {
        const [current, total] = t.players.split('/').map(Number);
        return {
          ...t,
          players: `${current + 1}/${total}`
        };
      }
      return t;
    });
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));

    setStep(4);
  };

  const handleClose = () => {
    setStep(1);
    setGameDetails({ gameName: '', uid: '', whatsappNumber: '', squadMembers: ['', '', ''] });
    setPaymentData({ transactionId: '', amount: 0 });
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">{tournament.title}</h3>
        <p className="text-cyan-400 text-sm">{tournament.type} Tournament</p>
      </div>

      {!isAuthenticated && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <UserPlus className="w-4 h-4 text-yellow-400" />
            <p className="text-yellow-400 text-sm font-medium">Authentication Required</p>
          </div>
          <p className="text-gray-300 text-xs">
            You need to sign up or login before joining any tournament. This helps us maintain fair play and communicate with you.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-black/20 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300 text-xs">Date & Time</span>
          </div>
          <p className="text-white text-sm font-medium">{new Date(tournament.startTime).toLocaleString()}</p>
        </div>

        <div className="bg-black/20 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300 text-xs">Prize Pool</span>
          </div>
          <p className="text-white text-sm font-medium">{tournament.prize}</p>
        </div>

        <div className="bg-black/20 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-gray-300 text-xs">Map</span>
          </div>
          <p className="text-white text-sm font-medium">{tournament.map}</p>
        </div>

        <div className="bg-black/20 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300 text-xs">Slots</span>
          </div>
          <p className="text-white text-sm font-medium">{tournament.players}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-cyan-500/20">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-medium">Entry Fee</p>
            <p className="text-xl font-bold text-cyan-400">{tournament.entryFee}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm">Mode</p>
            <p className="text-white font-medium">{tournament.type}</p>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleJoinClick}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
      >
        {isAuthenticated ? 'Proceed to Join' : 'Sign Up / Login to Join'}
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Game Details</h3>
        <p className="text-gray-300">Enter your Free Fire game information</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Free Fire Game Name *
          </label>
          <Input
            placeholder="Enter your in-game name"
            value={gameDetails.gameName}
            onChange={(e) => setGameDetails({...gameDetails, gameName: e.target.value})}
            className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Free Fire UID *
          </label>
          <Input
            placeholder="Enter your UID"
            value={gameDetails.uid}
            onChange={(e) => setGameDetails({...gameDetails, uid: e.target.value})}
            className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            WhatsApp Number * (for group invite)
          </label>
          <Input
            placeholder="Enter your WhatsApp number"
            value={gameDetails.whatsappNumber}
            onChange={(e) => setGameDetails({...gameDetails, whatsappNumber: e.target.value})}
            className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
          />
          <p className="text-gray-400 text-xs mt-1">
            You will be added to tournament WhatsApp group
          </p>
        </div>

        {tournament.type === 'Squad' && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Squad Member UIDs (Optional)
            </label>
            {gameDetails.squadMembers.map((member, index) => (
              <Input
                key={index}
                placeholder={`Squad Member ${index + 1} UID`}
                value={member}
                onChange={(e) => {
                  const newMembers = [...gameDetails.squadMembers];
                  newMembers[index] = e.target.value;
                  setGameDetails({...gameDetails, squadMembers: newMembers});
                }}
                className="bg-black/20 border-gray-600 text-white placeholder-gray-400 mb-2"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep(1)}
          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Back
        </Button>
        <Button 
          onClick={handleGameDetailsSubmit}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
        >
          Next
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <UPIPayment
      amount={entryFeeAmount}
      onSuccess={handlePaymentSuccess}
      onBack={() => setStep(2)}
    />
  );

  const renderStep4 = () => {
    const slotNumber = JSON.parse(localStorage.getItem('matchHistory') || '[]').slice(-1)[0]?.slotNumber || 12;
    
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Successfully Joined!</h3>
          <p className="text-gray-300">You've successfully joined this tournament</p>
        </div>

        <div className="bg-black/20 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Slot Number:</span>
            <span className="text-cyan-400 font-bold">#{slotNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Match Date:</span>
            <span className="text-white">{new Date(tournament.startTime).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Match Time:</span>
            <span className="text-white">{new Date(tournament.startTime).toLocaleTimeString()}</span>
          </div>
          {!isFree && paymentData.transactionId && (
            <div className="flex justify-between">
              <span className="text-gray-300">Transaction ID:</span>
              <span className="text-green-400 font-mono text-sm">{paymentData.transactionId}</span>
            </div>
          )}
        </div>

        <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
          <p className="text-cyan-300 text-sm">
            🎮 Room ID & Password will be sent 15 minutes before the match starts. Check your WhatsApp group!
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={handleClose}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
          >
            Go to My Matches
          </Button>
          <Button 
            variant="outline"
            onClick={handleClose}
            className="flex-1 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black"
          >
            Join Another Match
          </Button>
        </div>
      </div>
    );
  };

  const content = (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleClose}>
        <DrawerContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-gray-700 max-h-[95vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-white text-center text-lg">Tournament Details</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto flex-1">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-gray-700 max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-white text-center text-lg">Tournament Details</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[75vh]">
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TournamentJoinFlow;
