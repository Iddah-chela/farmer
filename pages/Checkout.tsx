import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initiateSTKPush, checkTransactionStatus } from '../services/mockPayHero';
import { MPESA_COLOR } from '../constants';
import { CheckCircle, Loader2, Smartphone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getListingById, saveOrder, updateUserTransaction } from '../services/storageService';
import { Order, OrderStatus } from '../types';

export const Checkout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateUserStats } = useAuth();
  const listing = getListingById(id || '');

  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [quantity, setQuantity] = useState(100); // Default quantity

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="p-4 max-w-md mx-auto h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto text-yellow-600 mb-3" size={48} />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">You need to login to make a purchase.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-4 max-w-md mx-auto h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto text-red-600 mb-3" size={48} />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Listing Not Found</h2>
          <p className="text-gray-600 mb-4">This listing may have been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const totalCost = listing.pricePerKg * quantity;

  const handlePayment = async () => {
    if (!phoneNumber.startsWith('254')) {
      alert("Please use format 2547...");
      return;
    }

    setStep('processing');
    setStatusMessage("Sending STK Push to your phone...");

    try {
      // 1. Initiate STK Push
      const response = await initiateSTKPush(phoneNumber, totalCost);
      
      if (response.success && response.transactionId) {
        setStatusMessage("Enter M-Pesa PIN on your phone...");
        
        // 2. Poll for status (Simulating Webhook/Callback)
        const pollResult = await checkTransactionStatus(response.transactionId);
        
        if (pollResult.status === 'SUCCESS') {
          // Create order
          const newOrder: Order = {
            id: `order-${Date.now()}`,
            listingId: listing.id,
            buyerName: user.id,
            quantity: quantity,
            totalAmount: totalCost,
            status: OrderStatus.ESCROW_HELD,
            mpesaTransactionId: response.transactionId,
          };

          // Save order
          saveOrder(newOrder);
          
          // Update user stats
          updateUserTransaction(user.id, newOrder, false);
          
          // Update local user state
          updateUserStats({
            orders: [...user.orders, newOrder]
          });

          setStep('success');
        } else {
          setStep('details');
          alert("Payment failed or timed out.");
        }
      }
    } catch (e) {
      console.error(e);
      setStep('details');
      alert("System error. Try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto h-screen flex flex-col justify-center pb-24">
      {step === 'details' && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Product</span>
              <span className="font-medium">{listing.cropType} (Grade {listing.grade})</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Seller</span>
              <span className="font-medium">{listing.farmerName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Location</span>
              <span className="font-medium">{listing.location}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Price per KG</span>
              <span className="font-medium">KES {listing.pricePerKg}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium mb-2">Quantity (KG)</label>
              <input 
                type="number" 
                min="1"
                max={listing.quantityKg}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {listing.quantityKg} kg
              </p>
            </div>
            
            <div className="flex justify-between border-t pt-3 mt-3">
              <span className="font-bold">Total (Escrow)</span>
              <span className="font-bold text-mpesa">KES {totalCost.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Funds are held in Escrow by Pay Hero until you scan the farmer's QR code.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">M-Pesa Number</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="254712345678" 
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handlePayment}
            className="w-full bg-mpesa text-white font-bold py-3 rounded-lg shadow-md hover:bg-green-600 transition-colors"
          >
            Pay Securely with M-Pesa
          </button>
        </div>
      )}

      {step === 'processing' && (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <Loader2 size={48} className="animate-spin text-mpesa mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Check your phone</h3>
          <p className="text-gray-600">{statusMessage}</p>
        </div>
      )}

      {step === 'success' && (
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border-t-4 border-mpesa">
          <CheckCircle size={64} className="text-mpesa mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Payment Secured!</h3>
          <p className="text-gray-600 mb-6">Funds are now in Escrow. Proceed to the farmer and scan their QR code to release payment.</p>
          <button 
            onClick={() => navigate('/handshake')}
            className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg"
          >
            Go to Handshake
          </button>
        </div>
      )}
    </div>
  );
};