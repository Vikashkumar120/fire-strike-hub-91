import React, { useState, useEffect } from 'react';
import { Wallet as WalletIcon, Plus, Minus, History, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import UPIPayment from './UPIPayment';

interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'tournament_payment';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description: string;
  transactionId?: string;
  screenshot?: string;
}

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawUPI, setWithdrawUPI] = useState('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Load wallet data from localStorage
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[user?.id || ''] || { balance: 0, transactions: [] };
    setBalance(userWallet.balance);
    setTransactions(userWallet.transactions);
  }, [user]);

  const saveWalletData = (newBalance: number, newTransactions: WalletTransaction[]) => {
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    walletData[user?.id || ''] = {
      balance: newBalance,
      transactions: newTransactions
    };
    localStorage.setItem('walletData', JSON.stringify(walletData));
    
    // Save admin transaction history
    const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
    const latestTransaction = newTransactions[newTransactions.length - 1];
    if (latestTransaction) {
      adminTransactions.push({
        ...latestTransaction,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email
      });
      localStorage.setItem('adminTransactions', JSON.stringify(adminTransactions));
    }
  };

  const handleDepositSuccess = (transactionId: string, screenshot?: string) => {
    const amount = parseInt(depositAmount);
    const newTransaction: WalletTransaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      status: 'pending',
      timestamp: new Date().toISOString(),
      description: `Deposit of ₹${amount}`,
      transactionId,
      screenshot
    };

    const newTransactions = [...transactions, newTransaction];
    setTransactions(newTransactions);
    saveWalletData(balance, newTransactions);

    setShowDeposit(false);
    setDepositAmount('');
    
    toast({
      title: "Deposit Initiated!",
      description: "Your deposit is being processed. Balance will be updated after verification.",
    });
  };

  const handleDepositClick = () => {
    if (!depositAmount || parseInt(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
      return;
    }
    setShowDeposit(true);
  };

  const handleWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    
    if (!withdrawUPI.trim()) {
      toast({
        title: "UPI ID Required",
        description: "Please enter your UPI ID for withdrawal",
        variant: "destructive"
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    const newBalance = balance - amount;
    const newTransaction: WalletTransaction = {
      id: Date.now().toString(),
      type: 'withdraw',
      amount,
      status: 'pending',
      timestamp: new Date().toISOString(),
      description: `Withdrawal of ₹${amount} to ${withdrawUPI}`,
    };

    const newTransactions = [...transactions, newTransaction];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWalletData(newBalance, newTransactions);

    setShowWithdraw(false);
    setWithdrawAmount('');
    setWithdrawUPI('');
    
    toast({
      title: "Withdrawal Requested!",
      description: "Your withdrawal request has been submitted for processing.",
    });
  };

  const payFromWallet = (amount: number) => {
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: "Please deposit money to your wallet first",
        variant: "destructive"
      });
      setShowDeposit(true);
      return false;
    }

    const newBalance = balance - amount;
    const newTransaction: WalletTransaction = {
      id: Date.now().toString(),
      type: 'tournament_payment',
      amount,
      status: 'completed',
      timestamp: new Date().toISOString(),
      description: `Tournament entry fee payment`,
    };

    const newTransactions = [...transactions, newTransaction];
    setBalance(newBalance);
    setTransactions(newTransactions);
    saveWalletData(newBalance, newTransactions);

    return true;
  };

  if (showDeposit && depositAmount) {
    return (
      <UPIPayment
        amount={parseInt(depositAmount)}
        description={`Wallet deposit of ₹${depositAmount}`}
        onSuccess={handleDepositSuccess}
        onBack={() => setShowDeposit(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <IndianRupee className="w-5 h-5" />
            <span>Wallet Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-cyan-400 mb-4">₹{balance}</div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowDeposit(false)}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Deposit
            </Button>
            <Button 
              onClick={() => setShowWithdraw(true)}
              variant="outline"
              className="flex-1 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
            >
              <Minus className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deposit Input Section */}
      {!showDeposit && (
        <Card className="bg-black/30 border-green-500/20">
          <CardHeader>
            <CardTitle className="text-white">Add Money to Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Enter Amount (₹) *
              </label>
              <Input
                type="number"
                placeholder="Enter amount to add"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[100, 250, 500, 1000, 2000, 5000].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setDepositAmount(amount.toString())}
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                >
                  ₹{amount}
                </Button>
              ))}
            </div>

            <Button 
              onClick={handleDepositClick}
              disabled={!depositAmount || parseInt(depositAmount) <= 0}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <Card className="bg-black/30 border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-white">Withdraw Money</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Withdrawal Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                UPI ID
              </label>
              <Input
                placeholder="Enter your UPI ID"
                value={withdrawUPI}
                onChange={(e) => setWithdrawUPI(e.target.value)}
                className="bg-black/20 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowWithdraw(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleWithdraw}
                disabled={!withdrawAmount || parseInt(withdrawAmount) <= 0 || !withdrawUPI.trim()}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {transactions.slice().reverse().map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">{transaction.description}</p>
                  <p className="text-gray-400 text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    transaction.type === 'deposit' ? 'text-green-400' : 
                    transaction.type === 'withdraw' ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount}
                  </p>
                  <p className={`text-xs ${
                    transaction.status === 'completed' ? 'text-green-400' :
                    transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-gray-400 text-center py-4">No transactions yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wallet;
