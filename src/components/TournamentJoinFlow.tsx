
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Users, 
  Clock, 
  MapPin, 
  Wallet as WalletIcon, 
  User, 
  Calendar, 
  Star,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  IndianRupee,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import UPIPayment from './UPIPayment';

interface Tournament {
  id: number;
  title: string;
  type: string;
  entryFee: number;
  prizePool: number;
  slots: { filled: number; total: number };
  date: string;
  map?: string;
  status: string;
}

interface TournamentJoinFlowProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
}

const TournamentJoinFlow = ({ tournament, isOpen, onClose }: TournamentJoinFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userDetails, setUserDetails] = useState({
    uid: '',
    inGameName: '',
    teamName: '',
    teammates: ['']
  });
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'upi'>('wallet');
  const [walletBalance, setWalletBalance] = useState(0);
  const [showUPIPayment, setShowUPIPayment] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load user wallet balance
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[user?.id || ''] || { balance: 0, transactions: [] };
    setWalletBalance(userWallet.balance);
  }, [user]);

  const handleTeammateChange = (index: number, value: string) => {
    const newTeammates = [...userDetails.teammates];
    newTeammates[index] = value;
    setUserDetails({ ...userDetails, teammates: newTeammates });
  };

  const addTeammate = () => {
    if (userDetails.teammates.length < getMaxTeammates()) {
      setUserDetails({
        ...userDetails,
        teammates: [...userDetails.teammates, '']
      });
    }
  };

  const removeTeammate = (index: number) => {
    const newTeammates = userDetails.teammates.filter((_, i) => i !== index);
    setUserDetails({ ...userDetails, teammates: newTeammates });
  };

  const getMaxTeammates = () => {
    switch (tournament.type.toLowerCase()) {
      case 'solo': return 0;
      case 'duo': return 1;
      case 'squad': return 3;
      default: return 3;
    }
  };

  const handleWalletPayment = () => {
    if (walletBalance < tournament.entryFee) {
      toast({
        title: "Insufficient Balance",
        description: "Please add money to your wallet first",
        variant: "destructive"
      });
      setPaymentMethod('upi');
      return;
    }

    // Deduct from wallet
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[user?.id || ''] || { balance: 0, transactions: [] };
    
    userWallet.balance -= tournament.entryFee;
    const newTransaction = {
      id: Date.now().toString(),
      type: 'tournament_payment',
      amount: tournament.entryFee,
      status: 'completed',
      timestamp: new Date().toISOString(),
      description: `Tournament entry fee - ${tournament.title}`,
    };
    
    userWallet.transactions.push(newTransaction);
    walletData[user?.id || ''] = userWallet;
    localStorage.setItem('walletData', JSON.stringify(walletData));

    // Save tournament join activity for admin
    const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    const joinActivity = {
      action: 'joined_tournament',
      userName: user?.name,
      userEmail: user?.email,
      tournamentName: tournament.title,
      tournamentDetails: {
        uid: userDetails.uid,
        inGameName: userDetails.inGameName,
        teamName: userDetails.teamName,
        teammates: userDetails.teammates.filter(t => t.trim() !== ''),
        entryFee: tournament.entryFee,
        paymentMethod: 'wallet'
      },
      timestamp: new Date().toISOString()
    };
    
    userActivity.push(joinActivity);
    localStorage.setItem('userActivity', JSON.stringify(userActivity));

    toast({
      title: "Tournament Joined!",
      description: `Successfully joined ${tournament.title}`,
    });
    
    setCurrentStep(4);
  };

  const handleUPISuccess = (transactionId: string, screenshot?: string) => {
    // Save tournament join activity for admin
    const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    const joinActivity = {
      action: 'joined_tournament',
      userName: user?.name,
      userEmail: user?.email,
      tournamentName: tournament.title,
      tournamentDetails: {
        uid: userDetails.uid,
        inGameName: userDetails.inGameName,
        teamName: userDetails.teamName,
        teammates: userDetails.teammates.filter(t => t.trim() !== ''),
        entryFee: tournament.entryFee,
        paymentMethod: 'upi',
        transactionId,
        screenshot
      },
      timestamp: new Date().toISOString()
    };
    
    userActivity.push(joinActivity);
    localStorage.setItem('userActivity', JSON.stringify(userActivity));

    toast({
      title: "Tournament Joined!",
      description: `Successfully joined ${tournament.title}`,
    });
    
    setCurrentStep(4);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Enter Your Details</h2>
        <p className="text-gray-300">Please provide your Free Fire game details</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Free Fire UID *
          </label>
          <Input
            placeholder="Enter your Free Fire UID"
            value={userDetails.uid}
            onChange={(e) => setUserDetails({...userDetails, uid: e.target.value})}
            className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            In-Game Name *
          </label>
          <Input
            placeholder="Your in-game name"
            value={userDetails.inGameName}
            onChange={(e) => setUserDetails({...userDetails, inGameName: e.target.value})}
            className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {tournament.type.toLowerCase() !== 'solo' && (
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Team Name *
            </label>
            <Input
              placeholder="Enter your team name"
              value={userDetails.teamName}
              onChange={(e) => setUserDetails({...userDetails, teamName: e.target.value})}
              className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        )}

        {tournament.type.toLowerCase() !== 'solo' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-300 text-sm font-medium">
                Teammates ({userDetails.teammates.filter(t => t.trim() !== '').length}/{getMaxTeammates()})
              </label>
              {userDetails.teammates.length < getMaxTeammates() && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={addTeammate}
                  className="border-gray-600 text-gray-300"
                >
                  Add Teammate
                </Button>
              )}
            </div>
            
            {userDetails.teammates.map((teammate, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder={`Teammate ${index + 1} UID`}
                  value={teammate}
                  onChange={(e) => handleTeammateChange(index, e.target.value)}
                  className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
                />
                {userDetails.teammates.length > 1 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => removeTeammate(index)}
                    className="border-red-600 text-red-400"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={() => setCurrentStep(2)}
          disabled={!userDetails.uid || !userDetails.inGameName || 
            (tournament.type.toLowerCase() !== 'solo' && !userDetails.teamName)}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Payment Method</h2>
        <p className="text-gray-300">Entry Fee: ₹{tournament.entryFee}</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'wallet' 
                ? 'border-cyan-500 bg-cyan-500/10' 
                : 'border-gray-600 bg-black/20'
            }`}
            onClick={() => setPaymentMethod('wallet')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <WalletIcon className="w-6 h-6 text-cyan-400" />
                  <div>
                    <h3 className="text-white font-medium">Wallet Balance</h3>
                    <p className="text-gray-300 text-sm">₹{walletBalance} available</p>
                  </div>
                </div>
                {walletBalance >= tournament.entryFee ? (
                  <Badge className="bg-green-500/20 text-green-400">Sufficient</Badge>
                ) : (
                  <Badge className="bg-red-500/20 text-red-400">Insufficient</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all ${
              paymentMethod === 'upi' 
                ? 'border-cyan-500 bg-cyan-500/10' 
                : 'border-gray-600 bg-black/20'
            }`}
            onClick={() => setPaymentMethod('upi')}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <IndianRupee className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-white font-medium">UPI Payment</h3>
                  <p className="text-gray-300 text-sm">Pay via UPI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={() => setCurrentStep(3)}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Confirm Registration</h2>
        <p className="text-gray-300">Please review your details before payment</p>
      </div>

      <Card className="bg-black/20 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Registration Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Tournament:</span>
            <span className="text-white">{tournament.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">UID:</span>
            <span className="text-white">{userDetails.uid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">In-Game Name:</span>
            <span className="text-white">{userDetails.inGameName}</span>
          </div>
          {tournament.type.toLowerCase() !== 'solo' && (
            <div className="flex justify-between">
              <span className="text-gray-300">Team Name:</span>
              <span className="text-white">{userDetails.teamName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Entry Fee:</span>
            <span className="text-green-400">₹{tournament.entryFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Payment Method:</span>
            <span className="text-cyan-400">
              {paymentMethod === 'wallet' ? 'Wallet' : 'UPI'}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={() => {
            if (paymentMethod === 'wallet') {
              handleWalletPayment();
            } else {
              setShowUPIPayment(true);
            }
          }}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
        >
          Pay ₹{tournament.entryFee}
        </Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-green-400" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
        <p className="text-gray-300 mb-4">
          You have successfully registered for {tournament.title}
        </p>
        
        <div className="bg-black/20 border border-green-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-green-400 font-medium mb-2">What's Next?</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Tournament details will be shared via email</li>
            <li>• Join the tournament lobby 15 minutes before start time</li>
            <li>• Good luck and have fun!</li>
          </ul>
        </div>
      </div>

      <Button 
        onClick={onClose}
        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600"
      >
        Continue to Dashboard
      </Button>
    </div>
  );

  if (!isOpen) {
    return null;
  }

  if (showUPIPayment) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
        <UPIPayment
          amount={tournament.entryFee}
          onSuccess={handleUPISuccess}
          onBack={() => setShowUPIPayment(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <Card className="bg-black/30 backdrop-blur-md border border-gray-700 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <CardContent className="p-6">
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    currentStep >= step ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentJoinFlow;
