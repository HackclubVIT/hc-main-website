import { useState } from 'react';
import { api } from '../api';
import { HACKCLUB_DEPARTMENTS } from '../data/departments';

export default function RecruitmentPortal({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    registerNumber: '',
    email: '',
    phoneNumber: '',
    firstPreference: HACKCLUB_DEPARTMENTS[0] || 'Operations',
    secondPreference: HACKCLUB_DEPARTMENTS[1] || 'Technical',
    firstPrefReason: '',
    secondPrefReason: '',
    yearOfStudy: '1st',
    github: '',
    linkedin: '',
    projectDetails: '',
    skillToLearn: '',
    whyHackclub: '',
    productiveWebsiteQuestions: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^@]+@vitstudent\.ac\.in$/;
    return regex.test(email);
  };

  const validateRegNo = (reg) => {
    const regex = /^[0-9]{2}[a-zA-Z]{3}[0-9]{4}$/;
    return regex.test(reg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const triggerError = (msg) => {
      setError(msg);
      setTimeout(() => {
        const errEl = document.getElementById('recruitment-error-banner-bottom') || document.getElementById('recruitment-error-banner');
        if (errEl) {
          errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    };

    // Validations
    if (!formData.name.trim() || !formData.registerNumber.trim() || !formData.email.trim() || !formData.firstPrefReason.trim()) {
      triggerError('Please fill in all required fields marked with *.');
      return;
    }

    if (formData.secondPreference && formData.secondPreference !== 'None' && formData.secondPreference === formData.firstPreference) {
      triggerError('Your 1st and 2nd preferences must be different departments.');
      return;
    }

    if (formData.secondPreference && formData.secondPreference !== 'None' && !formData.secondPrefReason.trim()) {
      triggerError('Please provide a reason for your 2nd preference department.');
      return;
    }

    if (!formData.skillToLearn.trim()) {
      triggerError('Please answer: "What is the one technical/design skill you want to learn through HackClub? Why?"');
      return;
    }

    if (!formData.whyHackclub.trim()) {
      triggerError('Please answer: "Why HackClub?"');
      return;
    }

    if (!formData.productiveWebsiteQuestions.trim()) {
      triggerError('Please answer the question about building a student productivity website.');
      return;
    }

    const emailTrimmed = formData.email.trim().toLowerCase();
    const regTrimmed = formData.registerNumber.trim().toUpperCase();

    if (!validateEmail(emailTrimmed)) {
      triggerError('Enter a valid student email in format name.year@vitstudent.ac.in or name.lastnameyear@vitstudent.ac.in');
      return;
    }

    if (!validateRegNo(regTrimmed)) {
      triggerError('Enter a valid VIT register number (e.g., 24BCE1234)');
      return;
    }

    setLoading(true);
    try {
      await api.submitRecruitmentApplication({
        recruitmentId: 'recruitment-2026',
        ...formData,
        domain: formData.firstPreference,
        whyJoin: formData.firstPrefReason,
        email: emailTrimmed,
        registerNumber: regTrimmed
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      triggerError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-shell" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#020000', padding: '24px' }}>
        <div className="login-panel" style={{ maxWidth: '640px', width: '100%', textAlign: 'center', animation: 'fadeIn 0.6s ease' }}>
          <div className="brand-mark" style={{ margin: '0 auto 24px', background: 'var(--success)' }}>
            <span>✓</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Application Submitted!</h1>
          <p style={{ color: 'var(--mute)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you for applying to **HackClub VIT Chennai**. Your application for **{formData.firstPreference}** (1st Pref){formData.secondPreference && formData.secondPreference !== 'None' ? ` and **${formData.secondPreference}** (2nd Pref)` : ''} has been received.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,68,68,0.1)', padding: '24px', borderRadius: '12px', textAlign: 'left', marginBottom: '32px', fontFamily: 'monospace' }}>
            <p style={{ color: 'var(--orange)', fontWeight: 'bold', marginBottom: '12px' }}>$ cat next-steps.sh</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px', fontSize: '0.9rem', color: 'var(--mute)' }}>
              <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--success)' }}>[1]</span> Screening: We will review your department preferences and application.</li>
              <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--success)' }}>[2]</span> Update: Keep an eye on your student email ({formData.email.toLowerCase()}) for interview invites.</li>
              <li style={{ display: 'flex', gap: '8px' }}><span style={{ color: 'var(--success)' }}>[3]</span> Community: Keep building!</li>
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
          We don't look at resume formatting or grading points. We want to see your curiosity, your department drive, and what makes you tick.
        </p>

        {error && (
          <div id="recruitment-error-banner" style={{ background: 'rgba(172, 18, 12, 0.15)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '14px 18px', borderRadius: '12px', fontSize: '0.95rem', marginBottom: '28px', animation: 'fadeIn 0.3s ease' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="two-col-grid">
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

          <div className="two-col-grid">
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

          {/* Department Preferences */}
          <div className="two-col-grid">
            <label>
              1st Preference Department *
              <select
                value={formData.firstPreference}
                onChange={(e) => setFormData(prev => ({ ...prev, firstPreference: e.target.value }))}
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
                {HACKCLUB_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} style={{ backgroundColor: '#020000' }}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>

            <label>
              2nd Preference Department
              <select
                value={formData.secondPreference}
                onChange={(e) => setFormData(prev => ({ ...prev, secondPreference: e.target.value }))}
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
                <option value="None" style={{ backgroundColor: '#020000' }}>— None (Only 1st Preference) —</option>
                {HACKCLUB_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept} style={{ backgroundColor: '#020000' }}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="two-col-grid">
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
          </div>

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

          {/* 1st Preference Reason */}
          <label>
            Why do you want to join your 1st Preference ({formData.firstPreference})? *
            <textarea
              value={formData.firstPrefReason}
              onChange={(e) => setFormData(prev => ({ ...prev, firstPrefReason: e.target.value }))}
              placeholder={`Tell us why you are interested in the ${formData.firstPreference} department, relevant skills, or past experience...`}
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

          {/* 2nd Preference Reason */}
          {formData.secondPreference && formData.secondPreference !== 'None' && (
            <label>
              Why do you want to join your 2nd Preference ({formData.secondPreference})? *
              <textarea
                value={formData.secondPrefReason}
                onChange={(e) => setFormData(prev => ({ ...prev, secondPrefReason: e.target.value }))}
                placeholder={`Tell us why you are interested in the ${formData.secondPreference} department as your second choice...`}
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
          )}

          <label>
            Describe a project you have built or would like to build (Optional)
            <textarea
              value={formData.projectDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, projectDetails: e.target.value }))}
              placeholder="Give details about technologies, flow, or problem it solves."
              rows={3}
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

          {/* 3 Short Questions */}
          <div style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,68,68,0.12)', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--orange)' }}>Your Goals & Thinking</h3>

            <label>
              1. What is the one technical/design skill you want to learn through HackClub? Why? *
              <textarea
                value={formData.skillToLearn}
                onChange={(e) => setFormData(prev => ({ ...prev, skillToLearn: e.target.value }))}
                placeholder="Mention the skill and why you want to learn or master it..."
                rows={3}
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
              2. Why HackClub? *
              <textarea
                value={formData.whyHackclub}
                onChange={(e) => setFormData(prev => ({ ...prev, whyHackclub: e.target.value }))}
                placeholder="What draws you to HackClub over other technical clubs?"
                rows={3}
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
              3. Someone tells you: “Build a website that makes students more productive.” What questions would you ask before writing a single line of code? *
              <textarea
                value={formData.productiveWebsiteQuestions}
                onChange={(e) => setFormData(prev => ({ ...prev, productiveWebsiteQuestions: e.target.value }))}
                placeholder="List the clarification, audience, features, or design questions you would ask first..."
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
          </div>

          {error && (
            <div id="recruitment-error-banner-bottom" style={{ background: 'rgba(172, 18, 12, 0.15)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '14px 18px', borderRadius: '12px', fontSize: '0.95rem', marginTop: '12px', animation: 'fadeIn 0.3s ease' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="button button-primary"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px 28px',
              fontSize: '1.15rem',
              fontWeight: 'bold',
              background: loading ? 'rgba(255,68,68,0.3)' : 'linear-gradient(135deg, #ec3750 0%, #ff6b4a 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: loading ? 'none' : '0 6px 24px rgba(236, 55, 80, 0.4)',
              transition: 'all 0.2s ease-in-out',
              marginTop: '16px'
            }}
          >
            {loading ? 'Submitting Application...' : '🚀 Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
