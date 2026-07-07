import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';
import { showSuccess, showError } from '../utils/toast';

interface LoginPageProps {
  onLogin: (token: string, role: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('customer1');
  const [password, setPassword] = useState('Customer@123');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fillCredentials = (role: 'CUSTOMER' | 'OWNER') => {
    if (role === 'OWNER') {
      setUsername('owner1');
      setPassword('Owner@123');
      return;
    }

    setUsername('customer1');
    setPassword('Customer@123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(username, password);
      const { token, role, redirectPath } = response.data;
      onLogin(token, role);
      showSuccess(`Welcome ${username}!`);
      navigate(redirectPath || (role === 'CUSTOMER' ? '/customer' : '/owner'));
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login to JustEat</h2>
      <div className="form-group" style={{ marginBottom: '16px' }}>
        <label>Quick Login As</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="button" className="btn btn-secondary" disabled={loading} onClick={() => fillCredentials('CUSTOMER')}>
            Customer
          </button>
          <button type="button" className="btn btn-secondary" disabled={loading} onClick={() => fillCredentials('OWNER')}>
            Restaurant Owner
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username or Email</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username or email"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="form-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
      <div className="form-link">
        Forgot your password? <Link to="/forgot-password">Reset with OTP</Link>
      </div>
      <div className="form-link" style={{ marginTop: '30px', color: '#999', fontSize: '12px' }}>
        <strong>Test Credentials:</strong><br />
        Customer: customer1 / Customer@123<br />
        Owner: owner1 / Owner@123
      </div>
    </div>
  );
};

export default LoginPage;

