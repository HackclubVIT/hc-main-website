import { useState, useEffect } from 'react'
import { validCredentials } from '../data/mockData'

export default function LoginShell({ onLogin, onBackToLanding }) {
  const [loginMode, setLoginMode] = useState('user')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

  useEffect(() => {
    let interval;
    if (forgotPasswordTimer > 0) {
      interval = setInterval(() => {
        setForgotPasswordTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [forgotPasswordTimer])

  return (
    <div className="login-shell">
      <div className="login-panel">
        <div className="brand-mark">
          <span>h.</span>
        </div>
        <h1>HackClub VIT Chennai</h1>
        
        {showForgotPassword ? (
          <>
            <p>Forgot your password? Enter your email to reset it.</p>
            <form onSubmit={(event) => {
              event.preventDefault();
              if (forgotPasswordEmail) {
                window.alert("If you have written the email correctly, you will receive the email");
                setForgotPasswordSent(true);
                setForgotPasswordTimer(90);
              }
            }}>
              <label>
                Email address
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(event) => setForgotPasswordEmail(event.target.value)}
                  placeholder="Enter your email"
                />
              </label>
              <button className="button button-primary" type="submit" disabled={forgotPasswordSent && forgotPasswordTimer > 0} onClick={() => {
                if (forgotPasswordSent && forgotPasswordTimer === 0) {
                    window.alert("Resent email. Kindly check your spam folder as well");
                    setForgotPasswordTimer(90);
                }
              }}>
                {forgotPasswordSent ? (forgotPasswordTimer > 0 ? `Resend Email (${forgotPasswordTimer}s)` : 'Resend Email') : 'Submit'}
              </button>
              <button
                className="button button-secondary"
                type="button"
                style={{ marginTop: '12px' }}
                onClick={() => setShowForgotPassword(false)}
              >
                Back to login
              </button>
            </form>
          </>
        ) : (
          <>
            <p style={{ textAlign: 'center' }}>{loginMode === 'admin' ? 'Admin portal' : 'User portal'}</p>
            <form onSubmit={(event) => {
              event.preventDefault()
              setError('')
              if (credentials.email && credentials.password) {
                if (!credentials.email.endsWith('@vitstudent.ac.in')) {
                  setError('Enter your student email only. Personal emails are not allowed.');
                  return;
                }
                const passError = validatePassword(credentials.password);
                if (passError) {
                  setError(passError);
                  return;
                }
                if (loginMode === 'admin' && credentials.email !== validCredentials.adminEmail) {
                  setError('Invalid admin credentials.');
                  return;
                }
                if (loginMode === 'user' && credentials.email !== validCredentials.userEmail) {
                  setError('Invalid user credentials.');
                  return;
                }
                if (credentials.password !== validCredentials.password) {
                  setError('Invalid credentials.');
                  return;
                }
                onLogin(loginMode)
              } else {
                setError('Please fill in all fields.');
              }
            }}>
              {error && (
                <div style={{ background: 'rgba(172, 18, 12, 0.1)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              <label>
                Email address
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(event) => { setCredentials((prev) => ({ ...prev, email: event.target.value })); setError(''); }}
                  placeholder="name@vitstudent.ac.in"
                  style={{ marginBottom: '12px' }}
                />
              </label>
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
              
              {credentials.password.length > 0 && (() => {
                const hasMinLength = credentials.password.length >= 8;
                const hasUpperCase = /[A-Z]/.test(credentials.password);
                const hasLowerCase = /[a-z]/.test(credentials.password);
                const hasDigit = /[0-9]/.test(credentials.password);
                const hasSpecial = /[^A-Za-z0-9]/.test(credentials.password);
                const hasIdenticalConsecutive = /([a-zA-Z0-9])\1/.test(credentials.password);
                let hasSequential = false;
                for (let i = 0; i < credentials.password.length - 1; i++) {
                  let c1 = credentials.password.charCodeAt(i);
                  let c2 = credentials.password.charCodeAt(i + 1);
                  if ((c1 >= 48 && c1 <= 57 && c2 === c1 + 1) || 
                      (c1 >= 97 && c1 <= 122 && c2 === c1 + 1) || 
                      (c1 >= 65 && c1 <= 90 && c2 === c1 + 1)) {
                    hasSequential = true;
                    break;
                  }
                }
                const hasNoSequential = !hasSequential;
                const hasNoIdentical = !hasIdenticalConsecutive;

                const CheckIcon = ({ met, failed }) => (
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', marginRight: '6px' }}>
                    {met ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ) : failed ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                    )}
                  </span>
                );

                return (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '10px' }}>
                      <li style={{ display: 'flex', alignItems: 'center', color: hasMinLength ? 'var(--text)' : 'var(--text-muted)' }}><CheckIcon met={hasMinLength} /> 8 characters minimum</li>
                      <li style={{ display: 'flex', alignItems: 'center', color: hasUpperCase ? 'var(--text)' : 'var(--text-muted)' }}><CheckIcon met={hasUpperCase} /> 1 uppercase letter</li>
                      <li style={{ display: 'flex', alignItems: 'center', color: hasLowerCase ? 'var(--text)' : 'var(--text-muted)' }}><CheckIcon met={hasLowerCase} /> 1 lowercase letter</li>
                      <li style={{ display: 'flex', alignItems: 'center', color: hasDigit ? 'var(--text)' : 'var(--text-muted)' }}><CheckIcon met={hasDigit} /> 1 digit</li>
                      <li style={{ display: 'flex', alignItems: 'center', color: hasSpecial ? 'var(--text)' : 'var(--text-muted)' }}><CheckIcon met={hasSpecial} /> 1 special character</li>
                      <li style={{ display: 'flex', alignItems: 'center', color: hasNoIdentical ? 'var(--text)' : 'var(--danger)' }}><CheckIcon met={hasNoIdentical} failed={!hasNoIdentical} /> No identical consecutive characters</li>
                      <li style={{ display: 'flex', alignItems: 'center', color: hasNoSequential ? 'var(--text)' : 'var(--danger)' }}><CheckIcon met={hasNoSequential} failed={!hasNoSequential} /> No sequential characters</li>
                    </ul>
                  </div>
                );
              })()}

              <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                <a href="#" style={{ color: 'var(--highlight)', fontSize: '0.85rem', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>Forgot Password?</a>
              </div>
              <button className="button button-primary" type="submit">Sign In</button>
              <button
                className="button button-secondary"
                type="button"
                style={{ marginTop: '12px' }}
                onClick={() => { setLoginMode(loginMode === 'user' ? 'admin' : 'user'); setError(''); }}
              >
                {loginMode === 'user' ? 'Login as admin' : 'Login as user'}
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
        )}
      </div>
    </div>
  )
}
