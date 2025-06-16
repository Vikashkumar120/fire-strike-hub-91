
import React, { useState, useEffect } from 'react';
import { QrCode, Copy, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface UPIPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onBack: () => void;
}

const UPIPayment = ({ amount, onSuccess, onBack }: UPIPaymentProps) => {
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const { toast } = useToast();

  // UPI payment details
  const upiId = 'vik657@axl';
  const merchantName = 'FireTourneys';
  const upiUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=Tournament Entry Fee`;

  // Generate QR code using QR Server API
  useEffect(() => {
    const qrData = encodeURIComponent(upiUrl);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`;
    setQrCodeDataUrl(qrCodeUrl);
  }, [upiUrl]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast({
      title: "UPI ID Copied!",
      description: "UPI ID has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSubmit = () => {
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter your transaction ID",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Mock payment verification (in real app, this would verify with backend)
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(transactionId);
      toast({
        title: "Payment Successful!",
        description: "Your payment has been verified successfully",
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Complete Payment</h3>
        <p className="text-gray-300 text-sm">Scan QR code or use UPI ID to pay ₹{amount}</p>
      </div>

      {/* QR Code Section */}
      <Card className="bg-black/20 border border-cyan-500/20">
        <CardContent className="p-4 text-center">
          <div className="bg-white p-3 rounded-lg inline-block mb-3">
            {qrCodeDataUrl ? (
              <img 
                src={qrCodeDataUrl} 
                alt="UPI Payment QR Code" 
                className="w-32 h-32 rounded-lg"
                onError={() => {
                  toast({
                    title: "QR Code Error",
                    description: "Unable to load QR code. Please use UPI ID manually.",
                    variant: "destructive"
                  });
                }}
              />
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-16 h-16 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">Loading QR...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="bg-black/20 p-3 rounded-lg">
              <p className="text-gray-300 text-xs mb-1">Pay to UPI ID:</p>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-mono text-sm">{upiId}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUPI}
                  className="border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black h-8 px-2"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-3 rounded-lg">
              <p className="text-white font-medium text-sm">Amount: ₹{amount}</p>
              <p className="text-gray-300 text-xs">Tournament Entry Fee</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg">
        <h4 className="text-white font-medium mb-2 text-sm">📱 How to Pay:</h4>
        <ol className="text-gray-300 text-xs space-y-1">
          <li>1. Open any UPI app (PhonePe, Paytm, GPay)</li>
          <li>2. Scan the QR code above OR copy UPI ID</li>
          <li>3. Pay exactly ₹{amount}</li>
          <li>4. Copy the Transaction ID from your app</li>
          <li>5. Enter Transaction ID below and submit</li>
        </ol>
      </div>

      {/* Transaction ID Input */}
      <div className="space-y-2">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Transaction ID / UTR Number *
          </label>
          <Input
            placeholder="Enter your transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="bg-black/20 border-gray-600 text-white placeholder-gray-400 text-sm"
          />
          <p className="text-gray-400 text-xs mt-1">
            You can find this in your UPI app after successful payment
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handlePaymentSubmit}
          disabled={!transactionId.trim() || isProcessing}
          className="flex-1 bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700 text-sm"
        >
          {isProcessing ? "Verifying..." : "Confirm Payment"}
        </Button>
      </div>

      {/* Warning */}
      <div className="bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
        <p className="text-red-400 text-xs">
          ⚠️ Only pay the exact amount (₹{amount}). Do not pay more or less. 
          Payment verification may take 1-2 minutes.
        </p>
      </div>
    </div>
  );
};

export default UPIPayment;
