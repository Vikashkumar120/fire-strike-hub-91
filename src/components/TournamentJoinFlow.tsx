import React, { useState, useEffect } from 'react';
import { X, Camera, Upload, AlertCircle, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && isOpen) {
      fetchWalletBalance();
    }
  }, [user, isOpen]);

  const fetchWalletBalance = async () => {
    if (!user) return;

    try {
      const { data: walletData, error } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        return;
      }

      setWalletBalance(Number(walletData?.balance || 0));
    } catch (error) {
      console.error('Error:', error);
    }
  };

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

  const handleWalletPayment = async () => {
    if (!user) return;
    
    const entryFeeAmount = getEntryFeeAmount();
    
    if (walletBalance < entryFeeAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${entryFeeAmount - walletBalance} more. Please add money to your wallet first.`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Start transaction
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (walletError) {
        throw walletError;
      }

      // Deduct from wallet
      const newBalance = Number(walletData.balance) - entryFeeAmount;
      
      const { error: updateWalletError } = await supabase
        .from('wallets')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

      if (updateWalletError) {
        throw updateWalletError;
      }

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('wallet_transactions')
        .insert({
          user_id: user.id,
          wallet_id: walletData.id,
          type: 'tournament_payment',
          amount: entryFeeAmount,
          status: 'completed',
          description: `Tournament entry fee for ${tournament.title}`,
          transaction_id: `TXN_${Date.now()}`
        });

      if (transactionError) {
        throw transactionError;
      }

      // Join tournament
      const { error: joinError } = await supabase
        .from('tournament_participants')
        .insert({
          tournament_id: tournament.id.toString(),
          user_id: user.id,
          game_name: userDetails.gameName,
          uid: userDetails.uid,
          whatsapp_number: userDetails.whatsappNumber,
          teammates: userDetails.teammates.filter(t => t.trim()),
          slot_number: Math.floor(Math.random() * 100) + 1,
          payment_method: 'wallet',
          payment_data: { transactionId: `TXN_${Date.now()}` }
        });

      if (joinError) {
        throw joinError;
      }

      // Update tournament participant count
      const { error: updateTournamentError } = await supabase
        .from('tournaments')
        .update({ 
          current_players: tournament.slots.filled + 1 
        })
        .eq('id', tournament.id.toString());

      if (updateTournamentError) {
        console.error('Error updating tournament count:', updateTournamentError);
      }

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Tournament Joined Successfully!',
          message: `You have successfully joined ${tournament.title}. Good luck!`,
          type: 'success'
        });

      toast({
        title: "Tournament Joined Successfully!",
        description: `You have joined ${tournament.title}. Good luck!`,
      });

      onClose();
    } catch (error) {
      console.error('Error joining tournament:', error);
      toast({
        title: "Error",
        description: "Failed to join tournament. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
          <h3 className="text-xl font-bold text-white mb-2">Payment</h3>
          <p className="text-gray-300">Entry Fee: ₹{entryFeeAmount}</p>
        </div>

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
                disabled={walletBalance < entryFeeAmount || loading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
              >
                {loading ? 'Processing...' : walletBalance >= entryFeeAmount ? 'Pay Now' : 'Insufficient Balance'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {walletBalance < entryFeeAmount && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium text-sm">Insufficient Balance</p>
                <p className="text-yellow-300 text-sm mt-1">
                  Please add ₹{entryFeeAmount - walletBalance} more to your wallet from the Dashboard.
                </p>
              </div>
            </div>
          </div>
        )}

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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl border border-purple-500/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20 sticky top-0 bg-gradient-to-br from-slate-900 to-purple-900">
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
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {step}
                </div>
                {step < 2 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    currentStep > step ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </div>
      </div>
    </div>
  );
};

export default TournamentJoinFlow;
