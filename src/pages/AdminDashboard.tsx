
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  type: string;
  amount: number;
  status: string;
  timestamp: string;
  description: string;
  screenshot?: string;
}

const AdminDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load admin transaction history from localStorage
    const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
    setTransactions(adminTransactions);
  }, []);

  const handleApproveDeposit = (transactionId: string, userId: string, amount: number) => {
    // Update user's wallet balance
    const walletData = JSON.parse(localStorage.getItem('walletData') || '{}');
    const userWallet = walletData[userId] || { balance: 0, transactions: [] };
    
    // Add money to user's wallet
    userWallet.balance += amount;
    
    // Update transaction status to completed
    userWallet.transactions = userWallet.transactions.map((t: any) => 
      t.id === transactionId ? { ...t, status: 'completed' } : t
    );
    
    walletData[userId] = userWallet;
    localStorage.setItem('walletData', JSON.stringify(walletData));

    // Update admin transactions
    const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
    const updatedTransactions = adminTransactions.map((t: any) => 
      t.id === transactionId ? { ...t, status: 'completed', approvedAt: new Date().toISOString() } : t
    );
    localStorage.setItem('adminTransactions', JSON.stringify(updatedTransactions));

    setTransactions(updatedTransactions);
    
    toast({
      title: "Deposit Approved!",
      description: `₹${amount} has been added to user's wallet`,
    });
  };

  const handleRejectDeposit = (transactionId: string) => {
    const adminTransactions = JSON.parse(localStorage.getItem('adminTransactions') || '[]');
    const updatedTransactions = adminTransactions.map((t: any) => 
      t.id === transactionId ? { ...t, status: 'failed', rejectedAt: new Date().toISOString() } : t
    );
    localStorage.setItem('adminTransactions', JSON.stringify(updatedTransactions));

    setTransactions(updatedTransactions);
    
    toast({
      title: "Deposit Rejected",
      description: "Deposit request has been rejected",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      {/* Deposit Approvals */}
      <Card className="bg-black/30 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Deposit Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                <div>
                  <p className="text-white font-medium">{transaction.userName} - {transaction.description}</p>
                  <p className="text-gray-400 text-sm">{new Date(transaction.timestamp).toLocaleString()}</p>
                  {transaction.screenshot && (
                    <a href={transaction.screenshot} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs">View Screenshot</a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleApproveDeposit(transaction.id, transaction.userId!, transaction.amount)}
                    className="bg-green-600 hover:bg-green-700 size-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleRejectDeposit(transaction.id)}
                    className="bg-red-600 hover:bg-red-700 size-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
            {transactions.filter(t => t.type === 'deposit' && t.status === 'pending').length === 0 && (
              <p className="text-gray-400 text-center py-4">No pending deposit approvals</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
