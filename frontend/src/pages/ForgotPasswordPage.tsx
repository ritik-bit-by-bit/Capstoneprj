import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../api/apiService';
import { showError, showSuccess } from '../utils/toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.requestPasswordReset(email);
      setOtpSent(true);
      showSuccess('OTP sent to your email');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Unable to send OTP.';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showError('New password and confirm password do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.confirmPasswordReset(email, otp, newPassword);
      showSuccess('Password reset successful. Please login.');
      navigate('/login');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Unable to reset password.';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <p className="form-subtitle">Use OTP sent to your registered email to reset your account password.</p>

      {!otpSent ? (
        <form onSubmit={requestOtp}>
          <div className="form-group">
            <label htmlFor="email">Registered Email or Username</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="name@example.com or customer1"
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={resetPassword}>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={loading}
              maxLength={6}
              placeholder="6-digit OTP"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="At least 8 chars, with uppercase, lowercase, digit, special char"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginLeft: '10px' }}
            disabled={loading}
            onClick={() => {
              setOtpSent(false);
              setOtp('');
              setNewPassword('');
              setConfirmPassword('');
            }}
          >
            Back
          </button>
        </form>
      )}

      <div className="form-link">
        Remember your password? <Link to="/login">Login here</Link>
      </div>
      <div className="form-link" style={{ marginTop: '18px', color: '#999', fontSize: '12px' }}>
        <strong>Test Emails:</strong><br />
        customer1@justeat.test<br />
        owner1@justeat.test
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

