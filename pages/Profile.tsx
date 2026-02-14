import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, User } from '../types';
import {
  User as UserIcon,
  Mail,
  Phone,
  LogOut,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(authUser);

  // Sync with latest user data from localStorage on mount
  useEffect(() => {
    if (authUser) {
      const users = JSON.parse(localStorage.getItem('payhero_users') || '[]');
      const currentUser = users.find((u: any) => u.id === authUser.id);
      if (currentUser) {
        setUser(currentUser);
      }
    }
  }, [authUser]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isFarmer = user.role === UserRole.FARMER;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <UserIcon className="text-green-600" size={40} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {isFarmer ? '🌾 Farmer' : '🛒 Buyer'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <UserIcon className="mr-2 text-green-600" size={20} />
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Mail className="mr-3 text-gray-400" size={18} />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="mr-3 text-gray-400" size={18} />
              <span>{user.phone}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Calendar className="mr-3 text-gray-400" size={18} />
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {user.totalTransactions}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {isFarmer ? (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Earned</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      KSh {user.totalAmountEarned?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Quantity Sold</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {user.totalQuantitySold?.toLocaleString() || '0'} kg
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Package className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      KSh {user.totalAmountSpent?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <DollarSign className="text-orange-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Quantity Bought</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {user.totalQuantityBought?.toLocaleString() || '0'} kg
                    </p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <ShoppingCart className="text-indigo-600" size={24} />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Award className="mr-2 text-green-600" size={20} />
            Recent Activity
          </h2>
          
          {user.orders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto text-gray-300 mb-3" size={48} />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                {isFarmer
                  ? 'Start listing your harvest to make sales'
                  : 'Start buying crops from the marketplace'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      order.status === 'COMPLETED' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <Package
                        size={20}
                        className={
                          order.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                        }
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.quantity} kg
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      KSh {order.totalAmount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${
                      order.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Farmer-specific: Active Listings */}
        {isFarmer && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="mr-2 text-green-600" size={20} />
              My Listings
            </h2>
            
            {(!user.listings || user.listings.length === 0) ? (
              <div className="text-center py-8">
                <Package className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">No active listings</p>
                <button
                  onClick={() => navigate('/farmer')}
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{listing.cropType}</h3>
                    <p className="text-sm text-gray-600 mt-1">{listing.location}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm text-gray-500">{listing.quantityKg} kg</span>
                      <span className="font-semibold text-green-600">
                        KSh {listing.pricePerKg}/kg
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
