function CheckIcon({ met, failed }) {
  return (
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
}

// Live password-requirement checklist. Shown only while creating a new
// account (signup) — not during login.
export default function PasswordChecklist({ password }) {
  if (!password || password.length === 0) return null;

  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasIdenticalConsecutive = /([a-zA-Z0-9])\1/.test(password);

  let hasSequential = false;
  for (let i = 0; i < password.length - 1; i++) {
    const c1 = password.charCodeAt(i);
    const c2 = password.charCodeAt(i + 1);
    if ((c1 >= 48 && c1 <= 57 && c2 === c1 + 1) ||
        (c1 >= 97 && c1 <= 122 && c2 === c1 + 1) ||
        (c1 >= 65 && c1 <= 90 && c2 === c1 + 1)) {
      hasSequential = true;
      break;
    }
  }
  const hasNoSequential = !hasSequential;
  const hasNoIdentical = !hasIdenticalConsecutive;

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
}
