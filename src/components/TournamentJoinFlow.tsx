import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, AlertCircle, Wallet, CreditCard } from 'lucide-react';
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
  entryFee: number | string;
  prizePool: number;
  slots: { filled: number; total: number };
  date: string;
  map: string;
  startTime: string;
  prize: string;
}

interface TournamentJoinFlowProps {
  tournament: Tournament;
  isOpen: boolean;
  onClose: () => void;
}

const TournamentJoinFlow = ({ tournament, isOpen, onClose }: TournamentJoinFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userDetails, setUserDetails] = useState({
    gameName: '',
    uid: '',
    whatsappNumber: '',
    teammates: ['', '', '']
  });
  const [showUPIPayment, setShowUPIPayment] = useState(false);
  const [showWalletDeposit, setShowWalletDeposit] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
      const userWallet = walletData[user.id] || { balance: 0, transactions: [] };
      setWalletBalance(userWallet.balance);
    }
  }, [user]);

  const getEntryFeeAmount = (): number => {
    if (typeof tournament.entryFee === 'string') {
      return parseInt(tournament.entryFee.replace(/[^\d]/g, '')) || 0;
    }
    return tournament.entryFee;
  };

  const handleTeammateChange = (index: number, value: string) => {
    const newTeammates = [...userDetails.teammates];
    newTeammates[index] = value;
    setUserDetails({ ...userDetails, teammates: newTeammates });
  };

  const validateStep1 = () => {
    if (!userDetails.gameName || !userDetails.uid || !userDetails.whatsappNumber) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleWalletPayment = () => {
    const entryFeeAmount = getEntryFeeAmount();
    console.log('Wallet balance:', walletBalance, 'Entry fee:', entryFeeAmount);
    
    if (walletBalance < entryFeeAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${entryFeeAmount - walletBalance} more to join this tournament`,
        variant: "destructive"
      });
      return;
    }

    // Deduct from wallet
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[user!.id] || { balance: 0, transactions: [] };
    
    userWallet.balance -= entryFeeAmount;
    userWallet.transactions.push({
      id: Date.now().toString(),
      type: 'tournament_join',
      amount: -entryFeeAmount,
      description: `Joined ${tournament.title}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });
    
    walletData[user!.id] = userWallet;
    localStorage.setItem('walletData', JSON.stringify(walletData));

    // Complete tournament join
    completeJoin('wallet', { transactionId: Date.now().toString() });
  };

  const handleUPIPaymentChoice = () => {
    const entryFeeAmount = getEntryFeeAmount();
    
    toast({
      title: "Redirecting to Wallet",
      description: "Please add money to your wallet first, then join the tournament",
    });
    
    // Redirect to wallet for deposit
    setShowWalletDeposit(true);
  };

  const handleWalletDepositSuccess = (transactionId: string, screenshot?: string) => {
    const entryFeeAmount = getEntryFeeAmount();
    
    // Save deposit transaction
    const newTransaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount: entryFeeAmount,
      status: 'pending',
      timestamp: new Date().toISOString(),
      description: `Wallet deposit for ${tournament.title}`,
      transactionId,
      screenshot
    };

    // Update wallet data
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[user!.id] || { balance: 0, transactions: [] };
    userWallet.transactions.push(newTransaction);
    walletData[user!.id] = userWallet;
    localStorage.setItem('walletData', JSON.stringify(walletData));

    setShowWalletDeposit(false);
    
    toast({
      title: "Deposit Initiated!",
      description: "Your deposit is being processed. You can join the tournament after admin approval.",
    });

    onClose();
  };

  const completeJoin = (paymentMethod: string, paymentData: any) => {
    if (!user) return;

    const matchData = {
      id: `${user.id}_${tournament.id}_${Date.now()}`,
      userId: user.id,
      tournament: tournament,
      gameDetails: userDetails,
      joinedAt: new Date().toISOString(),
      slotNumber: Math.floor(Math.random() * 100) + 1,
      paymentMethod: paymentMethod,
      paymentData: paymentData,
      result: null,
      resultScreenshot: null
    };

    // Save to match history
    const matchHistory = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    matchHistory.push(matchData);
    localStorage.setItem('matchHistory', JSON.stringify(matchHistory));

    const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    userActivity.push({
      id: user.id,
      userName: user.name,
      userEmail: user.email,
      action: 'joined_tournament',
      tournamentName: tournament.title,
      tournamentDetails: {
        uid: userDetails.uid,
        teamName: userDetails.gameName,
        entryFee: getEntryFeeAmount()
      },
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('userActivity', JSON.stringify(userActivity));

    toast({
      title: "Tournament Joined Successfully!",
      description: `You have joined ${tournament.title}. Good luck!`,
    });

    onClose();
  };

  const handleUPISuccess = (transactionId: string, screenshot?: string) => {
    const entryFeeAmount = getEntryFeeAmount();

    // Save tournament join activity for admin
    const userActivity = JSON.parse(localStorage.getItem('userActivity') || '[]');
    userActivity.push({
      id: user!.id,
      userName: user!.name,
      userEmail: user!.email,
      action: 'joined_tournament',
      tournamentName: tournament.title,
      tournamentDetails: {
        uid: userDetails.uid,
        teamName: userDetails.gameName,
        entryFee: entryFeeAmount
      },
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('userActivity', JSON.stringify(userActivity));

    completeJoin('upi', { transactionId, screenshot });
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Enter Game Details</h3>
      
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Free Fire Game Name *
        </label>
        <Input
          placeholder="Enter your in-game name"
          value={userDetails.gameName}
          onChange={(e) => setUserDetails({...userDetails, gameName: e.target.value})}
          className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
        />
      </div>

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
          WhatsApp Number *
        </label>
        <Input
          placeholder="Enter your WhatsApp number"
          value={userDetails.whatsappNumber}
          onChange={(e) => setUserDetails({...userDetails, whatsappNumber: e.target.value})}
          className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
        />
      </div>

      {tournament.type === 'Squad' && (
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Squad Members (Optional)
          </label>
          {userDetails.teammates.map((teammate, index) => (
            <Input
              key={index}
              placeholder={`Squad member ${index + 1} name`}
              value={teammate}
              onChange={(e) => handleTeammateChange(index, e.target.value)}
              className="bg-black/20 border-gray-600 text-white placeholder-gray-400 mb-2"
            />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button 
          onClick={onClose}
          variant="outline" 
          className="flex-1 border-gray-600 text-gray-300"
        >
          Cancel
        </Button>
        <Button 
          onClick={() => {
            if (validateStep1()) {
              setCurrentStep(2);
            }
          }}
          className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600"
        >
          Next Step
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const entryFeeAmount = getEntryFeeAmount();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Choose Payment Method</h3>
          <p className="text-gray-300">Entry Fee: ₹{entryFeeAmount}</p>
        </div>

        <div className="space-y-4">
          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Pay with Wallet</p>
                    <p className="text-gray-400 text-sm">Current Balance: ₹{walletBalance}</p>
                  </div>
                </div>
                <Button
                  onClick={handleWalletPayment}
                  disabled={walletBalance < entryFeeAmount}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
                >
                  {walletBalance >= entryFeeAmount ? 'Pay Now' : 'Insufficient Balance'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Add Money to Wallet</p>
                    <p className="text-gray-400 text-sm">Add ₹{entryFeeAmount} to your wallet</p>
                  </div>
                </div>
                <Button
                  onClick={handleUPIPaymentChoice}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add to Wallet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            💡 Add money to your wallet first, then join tournaments easily with one click!
          </p>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setCurrentStep(1)}
            variant="outline" 
            className="flex-1 border-gray-600 text-gray-300"
          >
            Back
          </Button>
          <Button 
            onClick={onClose}
            variant="outline" 
            className="flex-1 border-red-600 text-red-400"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const entryFeeAmount = getEntryFeeAmount();

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">UPI Payment</h3>
          <p className="text-gray-300">Entry Fee: ₹{entryFeeAmount}</p>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-medium text-sm">Payment Instructions</p>
              <ul className="text-yellow-300 text-sm mt-1 space-y-1">
                <li>• Pay the exact amount using any UPI app</li>
                <li>• Upload payment screenshot for verification</li>
                <li>• Your tournament slot will be confirmed after payment verification</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setCurrentStep(2)}
            variant="outline" 
            className="flex-1 border-gray-600 text-gray-300"
          >
            Back
          </Button>
          <Button 
            onClick={() => setShowUPIPayment(true)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    );
  };

  if (showUPIPayment) {
    const entryFeeAmount = getEntryFeeAmount();

    return (
      <UPIPayment
        amount={entryFeeAmount}
        description={`Entry fee for ${tournament.title}`}
        onSuccess={handleUPISuccess}
        onBack={() => setShowUPIPayment(false)}
      />
    );
  }

  if (showWalletDeposit) {
    const entryFeeAmount = getEntryFeeAmount();

    return (
      <UPIPayment
        amount={entryFeeAmount}
        description={`Add ₹${entryFeeAmount} to wallet for ${tournament.title}`}
        onSuccess={handleWalletDepositSuccess}
        onBack={() => setShowWalletDeposit(false)}
      />
    );
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl border border-purple-500/20 w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h2 className="text-lg font-bold text-white">Join {tournament.title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>
      </div>
    </div>
  );
};

export default TournamentJoinFlow;
