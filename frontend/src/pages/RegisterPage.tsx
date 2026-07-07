import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';
import { showSuccess, showError } from '../utils/toast';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CUSTOMER');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      showError('Password must be at least 8 characters');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!])/.test(password)) {
      showError('Password must contain uppercase, lowercase, digit, and special character (@#$%^&+=!)');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(username, password, role, email);
      showSuccess('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed. Please try again.';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Register to JustEat</h2>
      <p className="form-subtitle">Create your account with a valid email for OTP-based password reset.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char"
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">I am a:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="OWNER">Restaurant Owner</option>
          </select>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="form-link">
        Already have an account? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;

