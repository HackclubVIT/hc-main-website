import { useState, useEffect } from 'react'
import { api } from '../api'
import PasswordChecklist from './PasswordChecklist'
import { HACKCLUB_DEPARTMENTS } from '../data/departments'

export default function LoginShell({ onLogin, onBackToLanding }) {
  const [loginMode, setLoginMode] = useState('user')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0)
  const [forgotStage, setForgotStage] = useState('email') // 'email' | 'otp' | 'reset'
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const resetForgotFlow = () => {
    setShowForgotPassword(false)
    setForgotStage('email')
    setForgotOtp('')
    setNewPassword('')
    setConfirmNewPassword('')
    setForgotPasswordTimer(0)
    setError('')
    setSuccessMessage('')
  }
  
  // Signup States
  const [isSignUp, setIsSignUp] = useState(false)
  const [signUpData, setSignUpData] = useState({ name: '', registerNumber: '', email: '', password: '', confirmPassword: '', department: '' })

  // OTP Login States
  const [authMethod, setAuthMethod] = useState('otp') // 'otp' or 'password'
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [error, setError] = useState('')

  const validatePassword = (p) => {
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(p)) return "Password must have at least 1 uppercase letter.";
    if (!/[a-z]/.test(p)) return "Password must have at least 1 lowercase letter.";
    if (!/[0-9]/.test(p)) return "Password must have at least 1 digit.";
    if (!/[^A-Za-z0-9]/.test(p)) return "Password must have at least 1 special character.";
    
    // Consecutive identical
    if (/([a-zA-Z0-9])\1/.test(p)) return "No identical consecutive alphabets or numbers allowed (e.g., 'aa', '11').";
    
    // Sequential
    for (let i = 0; i < p.length - 1; i++) {
      let c1 = p.charCodeAt(i);
      let c2 = p.charCodeAt(i + 1);
      if (c1 >= 48 && c1 <= 57 && c2 === c1 + 1) return "No sequential numbers allowed (e.g., '12').";
      if (c1 >= 97 && c1 <= 122 && c2 === c1 + 1) return "No sequential alphabets allowed (e.g., 'ab').";
      if (c1 >= 65 && c1 <= 90 && c2 === c1 + 1) return "No sequential alphabets allowed (e.g., 'AB').";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (email === 'khandelwalprachi42@gmail.com') return true;
    if (email === 'admin@vitstudent.ac.in' || email === 'user@vitstudent.ac.in') return true;
    const regex = /^[a-zA-Z-]+\.([a-zA-Z-]+)?[0-9]{4}@vitstudent\.ac\.in$/;
    return regex.test(email);
  };

  useEffect(() => {
    let interval;
    if (forgotPasswordTimer > 0) {
      interval = setInterval(() => {
        setForgotPasswordTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [forgotPasswordTimer])

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const handleSendOtp = async () => {
    setError('');
    setSuccessMessage('');
    const email = credentials.email ? credentials.email.trim() : '';
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Enter your student email only in format name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in');
      return;
    }

    setLoading(true);
    try {
      await api.sendOtp(email);
      setOtpSent(true);
      setOtpTimer(60);
      setSuccessMessage('An OTP code has been successfully sent to your student email. Please check your inbox (or spam folder).');
    } catch (err) {
      setError(err.message || 'Failed to send OTP email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!signUpData.name || !signUpData.registerNumber || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    const trimmedEmail = signUpData.email.trim();
    if (!validateEmail(trimmedEmail)) {
      setError('Enter your student email only in format name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in');
      return;
    }

    const trimmedReg = signUpData.registerNumber.trim().toUpperCase();
    if (!/^[0-9]{2}[a-zA-Z]{3}[0-9]{4}$/.test(trimmedReg)) {
      setError('Enter a valid VIT register number (e.g., 24BCE1234).');
      return;
    }

    const passError = validatePassword(signUpData.password);
    if (passError) {
      setError(passError);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.signup(signUpData.name, trimmedEmail, signUpData.password, trimmedReg, signUpData.department);
      setSuccessMessage(res.message || 'Registration successful! You can now log in.');
      setIsSignUp(false);
      setCredentials(prev => ({ ...prev, email: trimmedEmail }));
      setSignUpData({ name: '', registerNumber: '', email: '', password: '', confirmPassword: '', department: '' });
    } catch (err) {
      setError(err.message || 'Failed to sign up. Account may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-panel">
        <div className="brand-mark">
          <span>h.</span>
        </div>
        <h1>HackClub VIT Chennai</h1>
        
        {showForgotPassword ? (
          <>
            <p>
              {forgotStage === 'email' && 'Forgot your password? Enter your email and we\'ll send you a verification code.'}
              {forgotStage === 'otp' && 'Enter the 6-digit code we just emailed you.'}
              {forgotStage === 'reset' && 'Code verified. Set your new password below.'}
            </p>
            {error && (
              <div style={{ background: 'rgba(172, 18, 12, 0.1)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            {successMessage && (
              <div style={{ background: 'rgba(46, 125, 50, 0.1)', border: '1px solid var(--success)', color: '#b9f6ca', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                {successMessage}
              </div>
            )}

            {/* Stage 1 — request a reset OTP */}
            {forgotStage === 'email' && (
              <form onSubmit={async (event) => {
                event.preventDefault();
                setError('');
                setSuccessMessage('');
                const email = forgotPasswordEmail ? forgotPasswordEmail.trim() : '';
                if (!email) { setError('Please enter your email address.'); return; }
                if (!validateEmail(email)) {
                  setError('Enter your student email only in format name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in');
                  return;
                }
                setLoading(true);
                try {
                  await api.forgotPassword(email);
                  setForgotStage('otp');
                  setForgotPasswordTimer(60);
                  setSuccessMessage('A password reset OTP has been sent to your email. Check your inbox (and spam).');
                } catch (err) {
                  setError(err.message || 'No account found with this email.');
                } finally {
                  setLoading(false);
                }
              }}>
                <label>
                  Email address
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(event) => { setForgotPasswordEmail(event.target.value); setError(''); }}
                    placeholder="name@vitstudent.ac.in"
                  />
                </label>
                <button className="button button-primary" type="submit" disabled={loading} style={{ marginTop: '12px' }}>
                  {loading ? 'Sending Code...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {/* Stage 2 — verify the OTP */}
            {forgotStage === 'otp' && (
              <form onSubmit={async (event) => {
                event.preventDefault();
                setError('');
                if (!forgotOtp) { setError('Please enter the verification code.'); return; }
                setLoading(true);
                try {
                  await api.verifyResetOtp(forgotPasswordEmail.trim(), forgotOtp);
                  setForgotStage('reset');
                  setSuccessMessage('');
                } catch (err) {
                  setError(err.message || 'Incorrect or expired code.');
                } finally {
                  setLoading(false);
                }
              }}>
                <label>
                  Verification Code (OTP)
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(event) => { setForgotOtp(event.target.value); setError(''); }}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    style={{ fontFamily: 'monospace', letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', marginBottom: '12px' }}
                  />
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Didn't receive it? Check spam.</span>
                  <button
                    type="button"
                    disabled={forgotPasswordTimer > 0 || loading}
                    onClick={async () => {
                      setError('');
                      setLoading(true);
                      try {
                        await api.forgotPassword(forgotPasswordEmail.trim());
                        setForgotPasswordTimer(60);
                        setSuccessMessage('A new OTP has been sent to your email.');
                      } catch (err) {
                        setError(err.message || 'Failed to resend code.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    style={{ background: 'none', border: 'none', color: forgotPasswordTimer > 0 ? 'var(--text-muted)' : 'var(--highlight)', cursor: forgotPasswordTimer > 0 ? 'default' : 'pointer', fontWeight: 'bold' }}
                  >
                    {forgotPasswordTimer > 0 ? `Resend in ${forgotPasswordTimer}s` : 'Resend Code'}
                  </button>
                </div>
                <button className="button button-primary" type="submit" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            )}

            {/* Stage 3 — set the new password */}
            {forgotStage === 'reset' && (
              <form onSubmit={async (event) => {
                event.preventDefault();
                setError('');
                const passError = validatePassword(newPassword);
                if (passError) { setError(passError); return; }
                if (newPassword !== confirmNewPassword) { setError('Passwords do not match.'); return; }
                setLoading(true);
                try {
                  await api.resetPassword(forgotPasswordEmail.trim(), forgotOtp, newPassword);
                  const email = forgotPasswordEmail.trim();
                  resetForgotFlow();
                  setCredentials({ email, password: '' });
                  setAuthMethod('password');
                  setSuccessMessage('Password updated successfully. Please log in with your new password.');
                } catch (err) {
                  setError(err.message || 'Failed to reset password.');
                } finally {
                  setLoading(false);
                }
              }}>
                <label>
                  New Password
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) => { setNewPassword(event.target.value); setError(''); }}
                    placeholder="Create new password"
                    style={{ marginBottom: '12px' }}
                  />
                </label>

                <PasswordChecklist password={newPassword} />

                <label>
                  Confirm New Password
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(event) => { setConfirmNewPassword(event.target.value); setError(''); }}
                    placeholder="Confirm new password"
                    style={{ marginBottom: '12px' }}
                  />
                </label>

                <button className="button button-primary" type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </form>
            )}

            <button
              className="button button-secondary"
              type="button"
              style={{ marginTop: '12px' }}
              onClick={resetForgotFlow}
            >
              Back to login
            </button>
          </>
        ) : isSignUp ? (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--amber)', letterSpacing: '0.05em' }}>CREATE AN ACCOUNT</p>
            <form onSubmit={handleSignUp}>
              {error && (
                <div style={{ background: 'rgba(172, 18, 12, 0.1)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              {successMessage && (
                <div style={{ background: 'rgba(46, 125, 50, 0.1)', border: '1px solid var(--success)', color: '#b9f6ca', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {successMessage}
                </div>
              )}
              
              <label>
                Full Name / Username
                <input
                  type="text"
                  value={signUpData.name}
                  onChange={(event) => setSignUpData((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Enter name or username"
                  style={{ marginBottom: '12px' }}
                />
              </label>

              <label>
                Registration Number
                <input
                  type="text"
                  value={signUpData.registerNumber}
                  onChange={(event) => setSignUpData((prev) => ({ ...prev, registerNumber: event.target.value }))}
                  placeholder="e.g., 24BCE1234"
                  style={{ marginBottom: '12px', textTransform: 'uppercase' }}
                />
              </label>

              <label>
                Student Email address
                <input
                  type="email"
                  value={signUpData.email}
                  onChange={(event) => setSignUpData((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in"
                  style={{ marginBottom: '12px' }}
                />
              </label>

              <label>
                HackClub Department (optional)
                <select
                  value={signUpData.department}
                  onChange={(event) => setSignUpData((prev) => ({ ...prev, department: event.target.value }))}
                  style={{ marginBottom: '12px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text)', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer' }}
                >
                  <option value="" style={{ background: '#120202' }}>Select your department (you can set this later)</option>
                  {HACKCLUB_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} style={{ background: '#120202' }}>{dept}</option>
                  ))}
                </select>
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={signUpData.password}
                  onChange={(event) => setSignUpData((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Create password"
                  style={{ marginBottom: '12px' }}
                />
              </label>

              <PasswordChecklist password={signUpData.password} />

              <label>
                Confirm Password
                <input
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(event) => setSignUpData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  placeholder="Confirm password"
                  style={{ marginBottom: '12px' }}
                />
              </label>

              <button className="button button-primary" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up & Register'}
              </button>
              
              <button
                className="button button-secondary"
                type="button"
                style={{ marginTop: '12px' }}
                onClick={() => { setIsSignUp(false); setError(''); setSuccessMessage(''); }}
              >
                Already have an account? Sign In
              </button>

              <button
                className="button button-outlined"
                type="button"
                style={{ marginTop: '12px' }}
                onClick={onBackToLanding}
              >
                Back to Landing Page
              </button>
            </form>
          </>
        ) : (
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--amber)', letterSpacing: '0.05em' }}>{loginMode === 'admin' ? 'ADMIN PORTAL' : 'USER PORTAL'}</p>
            
            {/* Auth Method Selector */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                className={`nav-link ${authMethod === 'otp' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px 14px', background: authMethod === 'otp' ? 'rgba(172, 18, 12, 0.32)' : 'transparent', border: 'none', cursor: 'pointer', fontStyle: 'normal', color: 'white', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold' }}
                onClick={() => { setAuthMethod('otp'); setError(''); setSuccessMessage(''); }}
              >
                OTP Verification
              </button>
              <button
                type="button"
                className={`nav-link ${authMethod === 'password' ? 'active' : ''}`}
                style={{ flex: 1, padding: '10px 14px', background: authMethod === 'password' ? 'rgba(172, 18, 12, 0.32)' : 'transparent', border: 'none', cursor: 'pointer', fontStyle: 'normal', color: 'white', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold' }}
                onClick={() => { setAuthMethod('password'); setError(''); setSuccessMessage(''); }}
              >
                Password Login
              </button>
            </div>

            <form onSubmit={async (event) => {
              event.preventDefault()
              setError('')
              setSuccessMessage('')
              
              const email = credentials.email ? credentials.email.trim() : '';
              if (!email) {
                setError('Please fill in your email.');
                return;
              }

              if (!validateEmail(email)) {
                setError('Enter your student email only in format name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in');
                return;
              }

              if (authMethod === 'otp') {
                if (!otpSent) {
                  handleSendOtp();
                  return;
                }
                if (!otp) {
                  setError('Please enter the OTP sent to your email.');
                  return;
                }
                
                setLoading(true);
                try {
                  const res = await api.loginOtp(email, otp, loginMode);
                  if (res.role !== loginMode) {
                    setError(`Access Denied: You are attempting to log in as ${loginMode}, but your account has the role ${res.role}.`);
                    return;
                  }
                  onLogin(res.role);
                } catch (err) {
                  setError(err.message || 'Incorrect or expired OTP.');
                } finally {
                  setLoading(false);
                }
              } else {
                if (!credentials.password) {
                  setError('Please fill in your password.');
                  return;
                }
                const passError = validatePassword(credentials.password);
                if (passError) {
                  setError(passError);
                  return;
                }
                
                setLoading(true);
                try {
                  const res = await api.login(email, credentials.password, loginMode);
                  if (res.role !== loginMode) {
                    setError(`Access Denied: You are attempting to log in as ${loginMode}, but your account has the role ${res.role}.`);
                    return;
                  }
                  onLogin(res.role);
                } catch (err) {
                  setError(err.message || 'Incorrect email or password.');
                } finally {
                  setLoading(false);
                }
              }
            }}>
              {error && (
                <div style={{ background: 'rgba(172, 18, 12, 0.1)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              {successMessage && (
                <div style={{ background: 'rgba(46, 125, 50, 0.1)', border: '1px solid var(--success)', color: '#b9f6ca', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {successMessage}
                </div>
              )}

              <label>
                Email address
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="email"
                    value={credentials.email}
                    disabled={otpSent && authMethod === 'otp'}
                    onChange={(event) => { setCredentials((prev) => ({ ...prev, email: event.target.value })); setError(''); }}
                    placeholder="name@vitstudent.ac.in"
                    style={{ flex: 1 }}
                  />
                  {authMethod === 'otp' && otpSent && (
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{ padding: '10px 16px', borderRadius: '12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                      onClick={() => { setOtpSent(false); setOtp(''); setSuccessMessage(''); }}
                    >
                      Change Email
                    </button>
                  )}
                </div>
              </label>

              {authMethod === 'otp' ? (
                <>
                  {otpSent && (
                    <label>
                      Verification Code (OTP)
                      <input
                        type="text"
                        value={otp}
                        onChange={(event) => { setOtp(event.target.value); setError(''); }}
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        style={{ fontFamily: 'monospace', letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', marginBottom: '12px' }}
                      />
                    </label>
                  )}
                  
                  {otpSent ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Didn't receive email? Check spam.</span>
                      <button
                        type="button"
                        disabled={otpTimer > 0 || loading}
                        onClick={handleSendOtp}
                        style={{ background: 'none', border: 'none', color: otpTimer > 0 ? 'var(--text-muted)' : 'var(--highlight)', cursor: otpTimer > 0 ? 'default' : 'pointer', fontWeight: 'bold' }}
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend Code'}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="button button-primary"
                      type="button"
                      disabled={loading}
                      onClick={handleSendOtp}
                      style={{ marginBottom: '12px' }}
                    >
                      {loading ? 'Sending Code...' : 'Send Verification Code'}
                    </button>
                  )}

                  {otpSent && (
                    <button className="button button-primary" type="submit" disabled={loading}>
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>
                  )}
                </>
              ) : (
                <>
                  <label>
                    Password
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={credentials.password}
                        onChange={(event) => { setCredentials((prev) => ({ ...prev, password: event.target.value })); setError(''); }}
                        placeholder="Enter password"
                        style={{ width: '100%', paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </button>
                    </div>
                  </label>
                  
                  <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                    <a href="#" style={{ color: 'var(--highlight)', fontSize: '0.85rem', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); setForgotStage('email'); setForgotOtp(''); setNewPassword(''); setConfirmNewPassword(''); setForgotPasswordEmail(credentials.email || ''); setError(''); setSuccessMessage(''); }}>Forgot Password?</a>
                  </div>
                  <button className="button button-primary" type="submit" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </>
              )}

              <button
                className="button button-secondary"
                type="button"
                disabled={loading}
                style={{ marginTop: '12px' }}
                onClick={() => { setLoginMode(loginMode === 'user' ? 'admin' : 'user'); setError(''); setSuccessMessage(''); setOtpSent(false); setOtp(''); }}
              >
                {loginMode === 'user' ? 'Login as admin' : 'Login as user'}
              </button>
              <button
                className="button button-outlined"
                type="button"
                disabled={loading}
                style={{ marginTop: '12px', borderColor: 'var(--amber)', color: 'var(--amber)' }}
                onClick={() => { setIsSignUp(true); setError(''); setSuccessMessage(''); }}
              >
                Create new account (Sign Up)
              </button>
              <button
                className="button button-outlined"
                type="button"
                disabled={loading}
                style={{ marginTop: '12px' }}
                onClick={onBackToLanding}
              >
                Back to Landing Page
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
