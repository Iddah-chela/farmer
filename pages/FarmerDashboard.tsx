import React, { useState } from 'react';
import { Upload, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KENYAN_COUNTIES, CROPS } from '../constants';
import { Grade, HarvestListing, UserRole } from '../types';
import { addListing } from '../services/storageService';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    county: '',
    grade: 'A',
    price: ''
  });

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="p-4 pb-24 max-w-md mx-auto flex items-center justify-center min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto text-yellow-600 mb-3" size={48} />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">You need to login as a Farmer to list your harvest.</p>
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

  // Check if user is a farmer
  if (user.role !== UserRole.FARMER) {
    return (
      <div className="p-4 pb-24 max-w-md mx-auto flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="mx-auto text-red-600 mb-3" size={48} />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Farmer Access Only</h2>
          <p className="text-gray-600 mb-4">This page is only accessible to farmers. Your account is registered as a buyer.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Create new listing
    const newListing: HarvestListing = {
      id: `listing-${Date.now()}`,
      farmerName: user.id, // Store user ID as farmer reference
      cropType: formData.cropType,
      quantityKg: parseInt(formData.quantity),
      location: formData.county,
      grade: formData.grade as Grade,
      pricePerKg: parseInt(formData.price),
      saturationLevel: 'medium' // Default value
    };

    // Save to storage
    setTimeout(() => {
      try {
        addListing(newListing, user.id);
        setSubmitting(false);
        alert("🎉 Harvest Listed Successfully! Buyers can now see your listing.");
        setFormData({
          cropType: '',
          quantity: '',
          county: '',
          grade: 'A',
          price: ''
        });
        // Navigate to marketplace to see the listing
        navigate('/');
      } catch (error) {
        console.error('Error saving listing:', error);
        setSubmitting(false);
        alert("Error saving listing. Please try again.");
      }
    }, 800);
  };

  return (
    <div className="p-4 pb-24 max-w-md mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">List Your Harvest</h1>
        <p className="text-gray-600 text-sm">Reach thousands of buyers instantly.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        
        {/* Crop Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
          <select 
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            value={formData.cropType}
            onChange={(e) => setFormData({...formData, cropType: e.target.value})}
          >
            <option value="">Select Crop</option>
            {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (KG)</label>
          <input 
            type="number" 
            required
            placeholder="e.g. 500"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.quantity}
            onChange={(e) => setFormData({...formData, quantity: e.target.value})}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per KG (KES)</label>
          <input 
            type="number" 
            required
            placeholder="e.g. 120"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
          <div className="flex gap-4">
            {Object.values(Grade).map(g => (
              <label key={g} className={`flex-1 border rounded-lg p-3 text-center cursor-pointer ${formData.grade === g ? 'bg-green-50 border-mpesa text-mpesa font-bold' : 'border-gray-200'}`}>
                <input 
                  type="radio" 
                  name="grade" 
                  value={g} 
                  className="hidden" 
                  checked={formData.grade === g}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">County</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <select 
              required
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white"
              value={formData.county}
              onChange={(e) => setFormData({...formData, county: e.target.value})}
            >
              <option value="">Select County</option>
              {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Image Upload Placeholder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500">
          <Upload className="mb-2" />
          <span className="text-xs">Tap to upload photo (Optional)</span>
        </div>

        <button 
          type="submit" 
          disabled={submitting}
          className={`w-full bg-mpesa text-white font-bold py-4 rounded-lg text-lg shadow-lg active:scale-95 transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {submitting ? 'Listing...' : 'List Harvest'}
        </button>

      </form>
    </div>
  );
};