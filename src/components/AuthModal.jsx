import React, { useState } from 'react';
import { X, Lock, Phone, User, Store, KeyRound, ArrowRight, ShieldCheck, Mail, CheckCircle2 } from 'lucide-react';
import { 
  registerMerchantInDb, 
  loginMerchantWithPassword, 
  loginMerchantWithOtp, 
  DEMO_OTP 
} from '../utils/firebase';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onShowToast, 
  pendingAction = null 
}) {
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  
  // Form states
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Mobile or Email for login
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  
  // OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  
  // Loading & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    setError('');
    const targetMobile = mobile || identifier;
    const clean = String(targetMobile || '').replace(/\D/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    // Generate a clean 6-digit code or fallback to DEMO_OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setEnteredOtp(code); // pre-populate for effortless testing
    onShowToast?.(`Verification Code Sent: ${code}`);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await registerMerchantInDb({ 
        name, 
        mobile, 
        email, 
        password, 
        businessName 
      });
      onShowToast?.(`Welcome, ${user.name || user.businessName}! Account created.`);
      onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      let user;
      if (loginMethod === 'password') {
        const idVal = identifier || mobile;
        if (!idVal) throw new Error('Please enter your mobile number or email');
        user = await loginMerchantWithPassword({ identifier: idVal, password });
      } else {
        const phoneVal = mobile || identifier;
        if (!phoneVal) throw new Error('Please enter your mobile number');
        // Accept generated OTP or fallback DEMO_OTP
        const validOtp = enteredOtp === generatedOtp ? DEMO_OTP : enteredOtp;
        user = await loginMerchantWithOtp({ mobile: phoneVal, otp: validOtp });
      }
      onShowToast?.(`Logged in successfully! Welcome ${user.name || user.businessName}`);
      onSuccess(user);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card auth-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="auth-header">
          <div className="auth-badge-icon">
            <Lock size={22} />
          </div>
          <h2>{tab === 'login' ? 'Merchant Portal Login' : 'Create Merchant Account'}</h2>
          <p className="auth-sub">
            {pendingAction === 'publish'
              ? 'Please log in or create an account to publish and manage your live catalog.'
              : 'Access your catalog dashboard, real visitor analytics, and merchant tools.'}
          </p>
        </div>

        {/* Tab switcher: Login / Signup */}
        <div className="auth-tabs">
          <button 
            type="button" 
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Log In
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setError(''); }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="auth-error-banner">
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN TAB */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            {/* Login method sub-toggle */}
            <div className="login-method-toggle">
              <button 
                type="button" 
                className={`method-sub-btn ${loginMethod === 'password' ? 'active' : ''}`}
                onClick={() => { setLoginMethod('password'); setError(''); }}
              >
                Password Login
              </button>
              <button 
                type="button" 
                className={`method-sub-btn ${loginMethod === 'otp' ? 'active' : ''}`}
                onClick={() => { setLoginMethod('otp'); setError(''); }}
              >
                Instant OTP Login
              </button>
            </div>

            <div className="field-group">
              <label className="field-label">
                {loginMethod === 'password' ? 'Mobile Number or Email' : 'Mobile Number'}
              </label>
              <div className="input-with-icon">
                {loginMethod === 'password' && identifier.includes('@') ? (
                  <Mail size={16} className="input-left-icon" />
                ) : (
                  <Phone size={16} className="input-left-icon" />
                )}
                <input 
                  type={loginMethod === 'password' ? 'text' : 'tel'} 
                  placeholder={loginMethod === 'password' ? 'e.g. 9876543210 or merchant@mail.com' : 'e.g. 9876543210'}
                  value={identifier || mobile}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setMobile(e.target.value);
                  }}
                  className="custom-input with-icon"
                  required
                />
              </div>
            </div>

            {loginMethod === 'password' ? (
              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="input-with-icon">
                  <KeyRound size={16} className="input-left-icon" />
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="custom-input with-icon"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="field-group">
                <div className="otp-request-row">
                  <label className="field-label">6-Digit Verification Code</label>
                  {!otpSent ? (
                    <button 
                      type="button" 
                      className="send-otp-link"
                      onClick={handleSendOtp}
                    >
                      Get Code
                    </button>
                  ) : (
                    <span className="otp-sent-hint">Your Code: <strong>{generatedOtp || DEMO_OTP}</strong></span>
                  )}
                </div>

                <div className="input-with-icon">
                  <ShieldCheck size={16} className="input-left-icon" />
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit code"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="custom-input with-icon"
                    maxLength={6}
                    required
                  />
                </div>
                {!otpSent && (
                  <span className="field-hint">Click 'Get Code' to receive instant verification</span>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="qd-spinner-sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Log In to Dashboard</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}

        {/* SIGNUP TAB */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <div className="field-group">
              <label className="field-label">Full Name <span className="req">*</span></label>
              <div className="input-with-icon">
                <User size={16} className="input-left-icon" />
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="custom-input with-icon"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Mobile Number <span className="req">*</span></label>
              <div className="input-with-icon">
                <Phone size={16} className="input-left-icon" />
                <input 
                  type="tel" 
                  placeholder="10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="custom-input with-icon"
                  required
                />
              </div>
              <span className="field-hint">Used for merchant login & customer WhatsApp communication</span>
            </div>

            <div className="field-group">
              <label className="field-label">Email Address (Optional)</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-left-icon" />
                <input 
                  type="email" 
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="custom-input with-icon"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Password <span className="req">*</span></label>
              <div className="input-with-icon">
                <KeyRound size={16} className="input-left-icon" />
                <input 
                  type="password" 
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="custom-input with-icon"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Store / Business Name (Optional)</label>
              <div className="input-with-icon">
                <Store size={16} className="input-left-icon" />
                <input 
                  type="text" 
                  placeholder="e.g. Haris Fashion Studio"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="custom-input with-icon"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="qd-spinner-sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer-note">
          <span>🔒 100% Client-Secure merchant session</span>
        </div>
      </div>
    </div>
  );
}
