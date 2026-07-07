import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { showSuccess } from '../../utils/toast';
import BrowseRestaurants from './BrowseRestaurants';
import OrderHistory from './OrderHistory';
import Preferences from './Preferences';

interface CustomerDashboardProps {
  onLogout: () => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    showSuccess('Logged out successfully');
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1>🍽️ JustEat</h1>
          <nav className="header-nav">
            <a href="/customer" onClick={(e) => { e.preventDefault(); navigate('/customer'); }}>Browse</a>
            <a href="/customer/history" onClick={(e) => { e.preventDefault(); navigate('/customer/history'); }}>Order History</a>
            <a href="/customer/preferences" onClick={(e) => { e.preventDefault(); navigate('/customer/preferences'); }}>Preferences</a>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<BrowseRestaurants />} />
          <Route path="/home" element={<BrowseRestaurants />} />
          <Route path="/history" element={<OrderHistory />} />
          <Route path="/preferences" element={<Preferences />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomerDashboard;

