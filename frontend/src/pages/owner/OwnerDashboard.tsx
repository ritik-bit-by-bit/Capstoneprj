import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { showSuccess } from '../../utils/toast';
import ManageRestaurants from './ManageRestaurants';
import ManageMenu from './ManageMenu';
import ManageOrders from './ManageOrders';

interface OwnerDashboardProps {
  onLogout: () => void;
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ onLogout }) => {
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
          <h1>🍽️ JustEat Owner Portal</h1>
          <nav className="header-nav">
            <a href="/owner" onClick={(e) => { e.preventDefault(); navigate('/owner'); }}>Restaurants</a>
            <a href="/owner/menu" onClick={(e) => { e.preventDefault(); navigate('/owner/menu'); }}>Menu</a>
            <a href="/owner/orders" onClick={(e) => { e.preventDefault(); navigate('/owner/orders'); }}>Orders</a>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </nav>
        </div>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<ManageRestaurants />} />
          <Route path="/dashboard" element={<ManageRestaurants />} />
          <Route path="/menu" element={<ManageMenu />} />
          <Route path="/orders" element={<ManageOrders />} />
        </Routes>
      </div>
    </div>
  );
};

export default OwnerDashboard;

