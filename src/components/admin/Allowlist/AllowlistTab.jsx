import { useState } from 'react';
import { api } from '../../../api';

export default function AllowlistTab({ allowlist = [], setAllowlist }) {
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = allowlist.filter((entry) =>
    entry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const email = newEmail.trim().toLowerCase();
    if (!email) {
      setError('Please enter an email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.addAllowedEmail(email);
      setAllowlist(res.allowedEmails || []);
      setNewEmail('');
      setSuccess(`${email} can now create an account.`);
    } catch (err) {
      setError(err.message || 'Failed to add email to the allowlist.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, email) => {
    if (!window.confirm(`Remove ${email} from the signup allowlist? They will no longer be able to create a new account.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await api.removeAllowedEmail(id);
      setAllowlist(res.allowedEmails || []);
      setSuccess(`${email} removed from the allowlist.`);
    } catch (err) {
      setError(err.message || 'Failed to remove email.');
    }
  };

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Access Control</p>
          <h2>Signup Allowlist</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '640px' }}>
            Only the email addresses listed here can create a new account. Anyone attempting to
            sign up with an email not on this list will be blocked with a clear message.
          </p>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(172, 18, 12, 0.1)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(46, 125, 50, 0.1)', border: '1px solid var(--success)', color: '#b9f6ca', padding: '10px 14px', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '16px' }}>
          {success}
        </div>
      )}

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '24px' }}>
        <label style={{ flex: 1, minWidth: '260px' }}>
          Add an allowed email
          <input
            type="email"
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); setError(''); }}
            placeholder="name.lastname2024@vitstudent.ac.in"
            style={{ marginTop: '8px', width: '100%' }}
          />
        </label>
        <button className="button button-primary" type="submit" disabled={loading} style={{ height: '46px' }}>
          {loading ? 'Adding...' : 'Add to Allowlist'}
        </button>
      </form>

      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search allowed emails..."
          style={{ width: '100%', maxWidth: '360px' }}
        />
      </div>

      <div className="table-card">
        <div className="table-row table-head">
          <div>Email</div>
          <div>Added By</div>
          <div style={{ textAlign: 'right' }}>Action</div>
        </div>
        {filtered.length === 0 ? (
          <div className="table-row">
            <div style={{ color: 'var(--text-muted)' }}>
              {allowlist.length === 0 ? 'No emails allowlisted yet. Add one above.' : 'No emails match your search.'}
            </div>
          </div>
        ) : (
          filtered.map((entry) => (
            <div key={entry.id} className="table-row">
              <div style={{ wordBreak: 'break-all' }}>{entry.email}</div>
              <div style={{ color: 'var(--text-muted)' }}>{entry.addedBy || '—'}</div>
              <div style={{ textAlign: 'right' }}>
                <button
                  className="button button-outlined"
                  type="button"
                  style={{ color: '#ff5555', borderColor: 'rgba(255,85,85,0.4)', padding: '6px 14px' }}
                  onClick={() => handleRemove(entry.id, entry.email)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
