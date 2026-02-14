import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation, MapPin, User, Truck } from 'lucide-react';
import { MOCK_LISTINGS, MPESA_COLOR } from '../constants';

export const LocationView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = MOCK_LISTINGS.find(l => l.id === id);

  if (!listing) return <div className="p-4">Listing not found</div>;

  // Fallback coords if missing
  const lat = listing.coordinates?.lat || -1.2921;
  const lng = listing.coordinates?.lng || 36.8219;

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-10 p-4 flex items-center gap-4 bg-gradient-to-b from-black/50 to-transparent text-white">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="font-bold text-lg drop-shadow-md">Farm Location</span>
      </div>

      {/* Map View (Iframe Embed) */}
      <div className="flex-1 bg-gray-200 relative">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://maps.google.com/maps?q=${lat},${lng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
          title="Listing Location"
          className="w-full h-full object-cover"
        />
        
        {/* Saturation/Supply Badge on Map */}
        <div className="absolute bottom-64 right-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border border-gray-200 text-xs text-right z-0">
          <div className="font-bold text-gray-800">{listing.location} County</div>
          <div className={`font-medium ${listing.saturationLevel === 'high' ? 'text-green-600' : 'text-orange-600'}`}>
            Supply: {listing.saturationLevel?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Bottom Sheet Details */}
      <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] -mt-6 relative z-10 p-6 pb-safe">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">{listing.cropType} Farm</h2>
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin size={14} className="mr-1" />
              {listing.location}, Kenya
            </div>
          </div>
          <div className="bg-green-50 text-mpesa px-3 py-1 rounded-full text-sm font-bold border border-green-100">
            Grade {listing.grade}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="bg-gray-200 p-3 rounded-full">
            <User size={24} className="text-gray-600" />
          </div>
          <div>
            <div className="font-bold text-gray-800">{listing.farmerName}</div>
            <div className="text-xs text-gray-500">Verified Farmer • {listing.quantityKg}kg Available</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
             onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank')}
             className="flex items-center justify-center gap-2 bg-gray-100 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Navigation size={18} />
            Directions
          </button>
          
          <button 
             onClick={() => navigate(`/checkout/${listing.id}`)}
             className="flex items-center justify-center gap-2 bg-mpesa text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <Truck size={18} />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};