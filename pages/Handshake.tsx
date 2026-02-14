import React, { useState } from 'react';
import { disburseFunds } from '../services/mockPayHero';
import { Scan, ArrowRight, Wallet, UserCheck } from 'lucide-react';

export const Handshake: React.FC = () => {
  const [mode, setMode] = useState<'farmer' | 'buyer'>('buyer');
  const [scanning, setScanning] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Farmer View: Shows QR Code
  const FarmerView = () => (
    <div className="text-center">
      <div className="bg-white p-6 rounded-xl shadow-lg inline-block mb-6">
         {/* Using an API to generate a real QR for visual effect */}
         <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=RELEASE_FUNDS_ORDER_123`} 
            alt="Handshake QR" 
            className="mx-auto"
         />
      </div>
      <p className="text-gray-600 text-sm font-medium">
        Show this to the Buyer upon delivery. <br/>
        Once scanned, funds will hit your M-Pesa instantly.
      </p>
    </div>
  );

  // Buyer View: Scans QR Code
  const BuyerView = () => {
    const handleScan = () => {
      setScanning(true);
      // Simulate scanning delay and API call to Disburse
      setTimeout(async () => {
        // Trigger Pay Hero B2C
        await disburseFunds('254712000000', 35000);
        setScanning(false);
        setCompleted(true);
      }, 2500);
    };

    if (completed) {
      return (
        <div className="text-center bg-green-50 p-8 rounded-xl border border-green-200">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <Wallet className="text-green-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Funds Released!</h3>
          <p className="text-green-700 mb-4">The farmer has been paid successfully.</p>
          <div className="text-xs text-gray-500">Transaction ID: B2C-8X92J91</div>
        </div>
      );
    }

    return (
      <div className="text-center">
        {scanning ? (
          <div className="bg-black rounded-xl h-64 w-full flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="w-48 h-48 border-2 border-green-500 rounded-lg z-10 animate-pulse relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,1)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
            <p className="text-white z-10 mt-4 font-mono">Align QR Code...</p>
            <style>{`
              @keyframes scan {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
            `}</style>
          </div>
        ) : (
          <div 
            onClick={handleScan}
            className="border-2 border-dashed border-gray-400 rounded-xl h-64 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Scan size={48} className="text-gray-400 mb-2" />
            <span className="text-gray-600 font-medium">Tap to Scan Farmer's Code</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto min-h-screen flex flex-col">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserCheck className="text-mpesa" /> 
          Trusted Handshake
        </h1>
        <p className="text-gray-600 text-sm">Verify delivery to release payments.</p>
      </header>

      {/* Role Toggle */}
      <div className="bg-gray-200 p-1 rounded-lg flex mb-8">
        <button 
          onClick={() => { setMode('buyer'); setCompleted(false); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'buyer' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
        >
          I am Buying
        </button>
        <button 
          onClick={() => { setMode('farmer'); setCompleted(false); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'farmer' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
        >
          I am Selling
        </button>
      </div>

      <div className="flex-1">
        {mode === 'farmer' ? <FarmerView /> : <BuyerView />}
      </div>
    </div>
  );
};