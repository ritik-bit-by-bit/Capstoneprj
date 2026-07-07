import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token: string, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to={userRole === 'CUSTOMER' ? '/customer' : '/owner'} />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={userRole === 'CUSTOMER' ? '/customer' : '/owner'} />} />
          <Route path="/forgot-password" element={!isAuthenticated ? <ForgotPasswordPage /> : <Navigate to={userRole === 'CUSTOMER' ? '/customer' : '/owner'} />} />
          <Route path="/customer/*" element={isAuthenticated && userRole === 'CUSTOMER' ? <CustomerDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/owner/*" element={isAuthenticated && userRole === 'OWNER' ? <OwnerDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isAuthenticated ? (userRole === 'CUSTOMER' ? '/customer' : '/owner') : '/login'} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

