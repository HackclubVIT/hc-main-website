import { useState, useEffect } from 'react'
import { api } from '../api'
import PasswordChecklist from './PasswordChecklist'
import { HACKCLUB_DEPARTMENTS } from '../data/departments'

export default function LoginShell({ onLogin, onBackToLanding }) {
  const [loginMode, setLoginMode] = useState('user')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotStage, setForgotStage] = useState('email') // 'email' | 'verify' | 'password' | 'success'
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [enteredCode, setEnteredCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0)

  // Signup states
  const [isSignUp, setIsSignUp] = useState(false)
  const [signUpData, setSignUpData] = useState({
    name: '', registerNumber: '', email: '', password: '', confirmPassword: '', department: ''
  })

  const resetForgotFlow = () => {
    setShowForgotPassword(false)
    setForgotStage('email')
    setForgotPasswordEmail('')
    setEnteredCode('')
    setNewPassword('')
    setConfirmNewPassword('')
    setShowNewPassword(false)
    setShowConfirmNewPassword(false)
    setForgotPasswordTimer(0)
    setError('')
    setSuccessMessage('')
  }

  const validatePassword = (p) => {
    if (p.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(p)) return "Password must have at least 1 uppercase letter.";
    if (!/[a-z]/.test(p)) return "Password must have at least 1 lowercase letter.";
    if (!/[0-9]/.test(p)) return "Password must have at least 1 digit.";
    if (!/[^A-Za-z0-9]/.test(p)) return "Password must have at least 1 special character.";
    if (/([a-zA-Z0-9])\1/.test(p)) return "No identical consecutive alphabets or numbers allowed (e.g., 'aa', '11').";
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
    if (!email || typeof email !== 'string') return false;
    const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return regex.test(email.trim());
  };

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (forgotPasswordTimer <= 0) return;
    const interval = setInterval(() => {
      setForgotPasswordTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [forgotPasswordTimer]);

  // ── Forgot password: request reset code ────────────────────────────────────
  const handleRequestResetCode = async (rawEmail) => {
    const email = rawEmail.trim().toLowerCase();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setForgotStage('verify');
      setForgotPasswordTimer(60);
    } catch (err) {
      setError(err.message || "Failed to generate reset code. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password: verify the code ───────────────────────────────────────
  const handleVerifyResetCode = async () => {
    setError('');
    if (!enteredCode.trim() || enteredCode.trim().length !== 6) { setError('Please enter the 6-digit code.'); return; }
    
    setLoading(true);
    try {
      await api.verifyResetCode(enteredCode.trim());
      setForgotStage('password');
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password: submit new password with code ─────────────────────────
  const handleResetPassword = async () => {
    setError('');
    if (!enteredCode.trim()) { setError('Missing reset code.'); return; }

    const passError = validatePassword(newPassword);
    if (passError) { setError(passError); return; }
    if (newPassword !== confirmNewPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await api.resetPassword(enteredCode.trim(), newPassword);
      setForgotStage('success');
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ─────────────────────────────────────────────────────────────────
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
      setError('Enter a valid student email ending with @vitstudent.ac.in');
      return;
    }

    const trimmedReg = signUpData.registerNumber.trim().toUpperCase();
    if (!/^[0-9]{2}[a-zA-Z]{3}[0-9]{4}$/.test(trimmedReg)) {
      setError('Enter a valid VIT register number (e.g., 24BCE1234).');
      return;
    }

    const passError = validatePassword(signUpData.password);
    if (passError) { setError(passError); return; }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.signup(signUpData.name, trimmedEmail, signUpData.password, trimmedReg, signUpData.department);
      setSuccessMessage(res.message || 'Registration successful! You can now log in.');
      setIsSignUp(false);
      setCredentials((prev) => ({ ...prev, email: trimmedEmail }));
      setSignUpData({ name: '', registerNumber: '', email: '', password: '', confirmPassword: '', department: '' });
    } catch (err) {
      setError(err.message || 'Failed to sign up. Account may already exist.');
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="login-shell">
      <div className="login-panel">
        <div className="brand-mark">
          <span>h.</span>
        </div>
        <h1>HackClub VIT Chennai</h1>

        {/* ── FORGOT PASSWORD FLOW ───────────────────────────────────── */}
        {showForgotPassword ? (
          <>
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

            {/* Stage 1 — enter email to get a reset code */}
            {forgotStage === 'email' && (
              <>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
                  Enter your email address and we&apos;ll send a 6-digit reset code to it.
                </p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const email = forgotPasswordEmail.trim().toLowerCase();
                  if (!email) { setError('Please enter your email address.'); return; }
                  if (!validateEmail(email)) {
                    setError('Enter a valid email address');
                    return;
                  }
                  await handleRequestResetCode(email);
                }}>
                  <label>
                    Email address
                    <input
                      type="email"
                      id="forgot-email"
                      value={forgotPasswordEmail}
                      onChange={(e) => { setForgotPasswordEmail(e.target.value); setError(''); }}
                      placeholder="name@vitstudent.ac.in"
                      style={{ marginBottom: '16px' }}
                      autoFocus
                    />
                  </label>
                  <button
                    id="send-reset-code-btn"
                    className="button button-primary"
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: '4px' }}
                  >
                    {loading ? 'Sending Code...' : 'Get Reset Code'}
                  </button>
                </form>
              </>
            )}

            {/* Stage 2 — enter reset code */}
            {forgotStage === 'verify' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔑</div>
                  <h3 style={{ color: 'var(--text)', marginBottom: '8px', fontSize: '1.1rem' }}>Enter Reset Code</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
                    We&apos;ve sent a 6-digit code to <strong style={{ color: 'var(--text)' }}>{forgotPasswordEmail}</strong>.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleVerifyResetCode(); }}>
                  <label>
                    Enter 6-Digit Code
                    <input
                      type="text"
                      id="reset-code-input"
                      value={enteredCode}
                      onChange={(e) => { setEnteredCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                      placeholder="Enter the 6-digit code"
                      style={{ marginBottom: '12px', letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.1rem', fontFamily: 'monospace' }}
                      maxLength={6}
                      autoFocus
                    />
                  </label>

                  <button
                    id="verify-code-btn"
                    className="button button-primary"
                    type="submit"
                    disabled={loading || enteredCode.length !== 6}
                    style={{ marginTop: '4px' }}
                  >
                    {loading ? 'Verifying Code...' : 'Verify Code'}
                  </button>
                </form>

                <button
                  id="request-new-code-btn"
                  type="button"
                  disabled={forgotPasswordTimer > 0 || loading}
                  onClick={() => handleRequestResetCode(forgotPasswordEmail)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: forgotPasswordTimer > 0 ? 'var(--text-muted)' : 'var(--highlight)',
                    cursor: forgotPasswordTimer > 0 ? 'default' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    padding: '12px 0 0',
                    display: 'block',
                    width: '100%',
                    textAlign: 'center'
                  }}
                >
                  {loading ? 'Sending...' : forgotPasswordTimer > 0
                    ? `Request new code in ${forgotPasswordTimer}s`
                    : 'Request a new code'}
                </button>
              </div>
            )}

            {/* Stage 3 — enter new password */}
            {forgotStage === 'password' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: 'var(--text)', marginBottom: '8px', fontSize: '1.1rem' }}>Create New Password</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '16px' }}>
                    Enter your new password below.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
                  <label>
                    New Password
                    <div style={{ position: 'relative', marginBottom: '4px' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="reset-new-password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                        placeholder="Create new password"
                        style={{ width: '100%', paddingRight: '44px' }}
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </button>
                    </div>
                  </label>

                  <PasswordChecklist password={newPassword} />

                  <label style={{ marginTop: '12px', display: 'block' }}>
                    Confirm New Password
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        id="reset-confirm-password"
                        value={confirmNewPassword}
                        onChange={(e) => { setConfirmNewPassword(e.target.value); setError(''); }}
                        placeholder="Confirm new password"
                        style={{ width: '100%', paddingRight: '44px' }}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                        aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmNewPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </button>
                    </div>
                  </label>

                  {confirmNewPassword && newPassword !== confirmNewPassword && (
                    <p style={{ color: '#ffb4ab', fontSize: '0.82rem', marginTop: '-6px', marginBottom: '12px' }}>
                      Passwords do not match.
                    </p>
                  )}

                  <button
                    id="reset-password-submit-btn"
                    className="button button-primary"
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: '4px' }}
                  >
                    {loading ? 'Resetting Password...' : 'Reset Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Stage 3 — success */}
            {forgotStage === 'success' && (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
                <h3 style={{ color: '#b9f6ca', marginBottom: '8px', fontSize: '1.05rem' }}>Password Reset Successfully!</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                  Your password has been updated. You can now sign in with your new password.
                </p>
              </div>
            )}

            <button
              id="back-to-login-btn"
              className="button button-secondary"
              type="button"
              style={{ marginTop: '8px' }}
              onClick={resetForgotFlow}
            >
              ← Back to Login
            </button>
          </>

        ) : isSignUp ? (
          /* ── SIGN UP FORM ──────────────────────────────────────────── */
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
                  onChange={(e) => setSignUpData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Enter name or username"
                  style={{ marginBottom: '12px' }}
                />
              </label>

              <label>
                Registration Number
                <input
                  type="text"
                  value={signUpData.registerNumber}
                  onChange={(e) => setSignUpData((p) => ({ ...p, registerNumber: e.target.value }))}
                  placeholder="e.g., 24BCE1234"
                  style={{ marginBottom: '12px', textTransform: 'uppercase' }}
                />
              </label>

              <label>
                Student Email address
                <input
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="name.year@vitstudent.ac.in"
                  style={{ marginBottom: '12px' }}
                />
              </label>

              <label>
                HackClub Department (optional)
                <select
                  value={signUpData.department}
                  onChange={(e) => setSignUpData((p) => ({ ...p, department: e.target.value }))}
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
                  onChange={(e) => setSignUpData((p) => ({ ...p, password: e.target.value }))}
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
                  onChange={(e) => setSignUpData((p) => ({ ...p, confirmPassword: e.target.value }))}
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
          /* ── LOGIN FORM ────────────────────────────────────────────── */
          <>
            <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--amber)', letterSpacing: '0.05em' }}>
              {loginMode === 'admin' ? 'ADMIN PORTAL' : 'USER PORTAL'}
            </p>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setError('');
              setSuccessMessage('');

              const email = credentials.email.trim();
              if (!email) { setError('Please enter your email address.'); return; }
              if (!validateEmail(email)) {
                setError('Enter a valid email address');
                return;
              }
              if (!credentials.password) { setError('Please enter your password.'); return; }

              const passError = validatePassword(credentials.password);
              if (passError) { setError(passError); return; }

              setLoading(true);
              try {
                const res = await api.login(email, credentials.password, loginMode);
                if (res.role !== loginMode) {
                  setError(`Access Denied: You are trying to log in as ${loginMode}, but your account role is ${res.role}.`);
                  return;
                }
                onLogin(res.role);
              } catch (err) {
                setError(err.message || 'Incorrect email or password.');
              } finally {
                setLoading(false);
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
                <input
                  id="login-email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => { setCredentials((p) => ({ ...p, email: e.target.value })); setError(''); }}
                  placeholder="name@vitstudent.ac.in"
                  style={{ marginBottom: '12px' }}
                  autoComplete="email"
                />
              </label>

              <label>
                Password
                <div style={{ position: 'relative', marginBottom: '4px' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => { setCredentials((p) => ({ ...p, password: e.target.value })); setError(''); }}
                    placeholder="Enter password"
                    style={{ width: '100%', paddingRight: '44px' }}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    id="toggle-password-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </label>

              <div style={{ textAlign: 'right', marginBottom: '20px', marginTop: '6px' }}>
                <a
                  href="#"
                  id="forgot-password-link"
                  style={{ color: 'var(--highlight)', fontSize: '0.85rem', textDecoration: 'none' }}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowForgotPassword(true);
                    setForgotStage('email');
                    setForgotPasswordEmail(credentials.email || '');
                    setError('');
                    setSuccessMessage('');
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              <button id="sign-in-btn" className="button button-primary" type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <button
                id="toggle-admin-login-btn"
                className="button button-secondary"
                type="button"
                disabled={loading}
                style={{ marginTop: '12px' }}
                onClick={() => { setLoginMode(loginMode === 'user' ? 'admin' : 'user'); setError(''); setSuccessMessage(''); }}
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
  );
}
