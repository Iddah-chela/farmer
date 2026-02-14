import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Marketplace } from './pages/Marketplace';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { Checkout } from './pages/Checkout';
import { Handshake } from './pages/Handshake';
import { LocationView } from './pages/LocationView';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';

// Floating WhatsApp Button Component
const WhatsAppSupport = () => (
  <a 
    href="https://wa.me/254700000000" 
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed bottom-20 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40 flex items-center justify-center"
  >
    <MessageCircle size={24} />
  </a>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
          <Routes>
            <Route path="/" element={<Marketplace />} />
            <Route path="/farmer" element={<FarmerDashboard />} />
            <Route path="/checkout/:id" element={<Checkout />} />
            <Route path="/handshake" element={<Handshake />} />
            <Route path="/location/:id" element={<LocationView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
          
          <Navbar />
          <WhatsAppSupport />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;