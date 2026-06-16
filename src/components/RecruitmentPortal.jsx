import { useState } from 'react';
import { api } from '../api';

export default function RecruitmentPortal({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    email: '',
    phoneNumber: '',
    domain: 'Web Development',
    yearOfStudy: '1st',
    github: '',
    linkedin: '',
    whyJoin: '',
    projectDetails: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z-]+\.([a-zA-Z-]+)?[0-9]{4}@vitstudent\.ac\.in$/;
    return regex.test(email);
  };

  const validateRegNo = (reg) => {
    // Standard register number like 24BCE1234
    const regex = /^[0-9]{2}[a-zA-Z]{3}[0-9]{4}$/;
    return regex.test(reg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name || !formData.registerNumber || !formData.email || !formData.whyJoin) {
      setError('Please fill in all required fields marked with *.');
      return;
    }

    const emailTrimmed = formData.email.trim().toLowerCase();
    const regTrimmed = formData.registerNumber.trim().toUpperCase();

    if (!validateEmail(emailTrimmed)) {
      setError('Enter a valid student email in format name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in');
      return;
    }

    if (!validateRegNo(regTrimmed)) {
      setError('Enter a valid VIT register number (e.g., 24BCE1234)');
      return;
    }

    setLoading(true);
    try {
      await api.submitRecruitmentApplication({
        ...formData,
        email: emailTrimmed,
        registerNumber: regTrimmed
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit application. You may have already applied.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020000', padding: '24px' }}>
        <div className="login-panel" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', animation: 'fadeIn 0.6s ease' }}>
          <div className="brand-mark" style={{ margin: '0 auto 24px', background: 'var(--success)' }}>
            <span>✓</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Application Received!</h1>
          <p style={{ color: 'var(--mute)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you for applying to **HackClub VIT Chennai**. Your application for the **{formData.domain}** domain has been logged.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,68,68,0.1)', padding: '24px', borderRadius: '12px', textAlign: 'left', marginBottom: '32px', fontFamily: 'monospace' }}>
            <p style={{ color: 'var(--orange)', fontWeight: 'bold', marginBottom: '12px' }}>$ cat next-steps.sh</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', fontSize: '0.9rem', color: 'var(--mute)' }}>
              <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--success)' }}>[1]</span> Screening: We will review your project links and responses.</li>
              <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--success)' }}>[2]</span> Update: Keep an eye on your student email ({formData.email.toLowerCase()}) for interview invites.</li>
              <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--success)' }}>[3]</span> Discord: Check out the official resources and keep building!</li>
            </ul>
          </div>

          <button className="button button-primary" onClick={onBack} style={{ width: '100%' }}>
            Return to Landing Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-shell" style={{ minHeight: '120vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020000', padding: '40px 24px' }}>
      <div className="login-panel" style={{ maxWidth: '750px', width: '100%', padding: '40px', animation: 'rise 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="brand-mark" style={{ margin: 0 }}>
            <span>h.</span>
          </div>
          <button className="button button-secondary" onClick={onBack} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            ← Back
          </button>
        </div>

        <p style={{ color: 'var(--orange)', fontFamily: 'monospace', letterSpacing: '0.15em', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>Join the Crew</p>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>Recruitment 2026</h1>
        <p style={{ color: 'var(--mute)', lineHeight: '1.6', marginBottom: '32px' }}>
          We don't look at resume formatting or grading points. We want to see your curiosity, your project build ideas, and what makes you tick.
        </p>

        {error && (
          <div style={{ background: 'rgba(172, 18, 12, 0.1)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '12px 16px', borderRadius: '12px', fontSize: '0.95rem', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Full Name *
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
                required
                style={{ marginTop: '8px' }}
              />
            </label>

            <label>
              Register Number *
              <input
                type="text"
                value={formData.registerNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, registerNumber: e.target.value }))}
                placeholder="e.g., 24BCE1024"
                required
                style={{ marginTop: '8px' }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Student Email address *
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name.year@vitstudent.ac.in"
                required
                style={{ marginTop: '8px' }}
              />
            </label>

            <label>
              Phone Number
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+91 XXXXX XXXXX"
                style={{ marginTop: '8px' }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Target Domain *
              <select
                value={formData.domain}
                onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Web Development" style={{ backgroundColor: '#020000' }}>Web Development</option>
                <option value="Mobile App Development" style={{ backgroundColor: '#020000' }}>Mobile App Development</option>
                <option value="AI / Machine Learning" style={{ backgroundColor: '#020000' }}>AI / Machine Learning</option>
                <option value="Systems & IoT" style={{ backgroundColor: '#020000' }}>Systems & IoT</option>
                <option value="UI/UX Design" style={{ backgroundColor: '#020000' }}>UI/UX Design</option>
                <option value="Content & Social Media" style={{ backgroundColor: '#020000' }}>Content & Social Media</option>
              </select>
            </label>

            <label>
              Year of Study *
              <select
                value={formData.yearOfStudy}
                onChange={(e) => setFormData(prev => ({ ...prev, yearOfStudy: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="1st" style={{ backgroundColor: '#020000' }}>1st Year</option>
                <option value="2nd" style={{ backgroundColor: '#020000' }}>2nd Year</option>
                <option value="3rd" style={{ backgroundColor: '#020000' }}>3rd Year</option>
                <option value="4th" style={{ backgroundColor: '#020000' }}>4th Year</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              GitHub Link
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                placeholder="github.com/username"
                style={{ marginTop: '8px' }}
              />
            </label>

            <label>
              LinkedIn Link
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="linkedin.com/in/username"
                style={{ marginTop: '8px' }}
              />
            </label>
          </div>

          <label>
            Why do you want to join HackClub VIT Chennai? *
            <textarea
              value={formData.whyJoin}
              onChange={(e) => setFormData(prev => ({ ...prev, whyJoin: e.target.value }))}
              placeholder="What makes you excited to be part of our builder crew?"
              rows={4}
              required
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '8px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                resize: 'vertical'
              }}
            />
          </label>

          <label>
            Describe a project you have built or would like to build
            <textarea
              value={formData.projectDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, projectDetails: e.target.value }))}
              placeholder="Give details about technologies, flow, or problem it solves."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '8px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                color: 'var(--text)',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                resize: 'vertical'
              }}
            />
          </label>

          <button className="button button-primary" type="submit" disabled={loading} style={{ marginTop: '12px' }}>
            {loading ? 'Submitting Proposal...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
