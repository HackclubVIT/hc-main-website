
import BadgeList from '../../../Leaderboard/BadgeShowcase/BadgeList';
import { HACKCLUB_DEPARTMENTS, isLeadRole, departmentFromRole } from '../../../data/departments';

export default function ProfileTab({ dashboardProfile, setDashboardProfile, dashboardPassword, setDashboardPassword }) {
  const role = dashboardProfile.role || 'Member';
  // Leads belong to the department baked into their role; only plain members
  // can pick/change their HackClub department here.
  const isLead = isLeadRole(role);
  const department = isLead ? departmentFromRole(role) : (dashboardProfile.department || '');
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">My Profile</p>
          <h2>Manage your profile and settings</h2>
        </div>
      </div>
      <div className="panel-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          window.alert('Profile changes are stored locally for this session.');
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
            <div className="avatar-wrap" style={{ margin: 0, padding: 0 }}>
              <div className="avatar" style={{ width: '64px', height: '64px' }}>
                {dashboardProfile.avatar && dashboardProfile.avatar.startsWith('emoji:') ? (
                  <span className="avatar-emoji" style={{ fontSize: '24px' }}>{dashboardProfile.avatar.replace('emoji:', '')}</span>
                ) : dashboardProfile.avatar ? (
                  <img src={dashboardProfile.avatar} alt="avatar" />
                ) : (
                  <span className="avatar-initial" style={{ fontSize: '24px' }}>{dashboardProfile.name ? dashboardProfile.name.charAt(0) : 'U'}</span>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="button button-outlined" style={{ width: 'max-content', cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files && e.target.files[0]
                    if (!f) return
                    const reader = new FileReader()
                    reader.onload = () => {
                      setDashboardProfile((prev) => ({ ...prev, avatar: String(reader.result) }))
                    }
                    reader.readAsDataURL(f)
                  }}
                />
                Change Avatar
              </label>
              <div className="avatar-picker" style={{ margin: 0 }}>
                <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:👩‍💻' }))} className="avatar-option">👩‍💻</button>
                <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:🚀' }))} className="avatar-option">🚀</button>
                <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:✨' }))} className="avatar-option">✨</button>
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <span className="eyebrow" style={{ margin: 0 }}>Role: {role}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px', background: 'rgba(255, 85, 85, 0.1)', color: '#ff5555', borderRadius: '4px', border: '1px solid rgba(255, 85, 85, 0.2)' }}>
                Reviewer Access: {dashboardProfile.isReviewer ? 'Yes' : 'No'}
              </span>
            </div>
            <BadgeList badges={dashboardProfile.badges} />
          </div>

          <label>
            Display Name
            <input 
              type="text" 
              value={dashboardProfile.name} 
              readOnly 
              style={{ marginTop: '8px', opacity: 0.7, cursor: 'not-allowed' }} 
            />
          </label>
          <label>
            Email Address
            <input 
              type="email" 
              value={dashboardProfile.email} 
              readOnly 
              style={{ marginTop: '8px', opacity: 0.7, cursor: 'not-allowed' }} 
            />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Register Number
              <input 
                type="text" 
                value={dashboardProfile.registerNumber} 
                readOnly 
                style={{ marginTop: '8px', width: '100%', opacity: 0.7, cursor: 'not-allowed' }} 
              />
            </label>
            <label>
              HackClub Department
              {isLead ? (
                <input
                  type="text"
                  value={department}
                  readOnly
                  title="Your department is set by your lead role."
                  style={{ marginTop: '8px', width: '100%', opacity: 0.7, cursor: 'not-allowed' }}
                />
              ) : (
                <select
                  value={department}
                  onChange={(e) => setDashboardProfile((prev) => ({ ...prev, department: e.target.value }))}
                  style={{ marginTop: '8px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text)', fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer' }}
                >
                  <option value="" style={{ background: '#120202' }}>— Select your department —</option>
                  {HACKCLUB_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} style={{ background: '#120202' }}>{dept}</option>
                  ))}
                </select>
              )}
            </label>
            <label>
              Phone Number
              <input 
                type="tel" 
                value={dashboardProfile.phoneNumber} 
                onChange={(e) => setDashboardProfile((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="e.g. +91 9876543210" 
                style={{ marginTop: '8px', width: '100%' }} 
              />
            </label>
            <label>
              Personal Portfolio
              <input 
                type="url" 
                value={dashboardProfile.portfolio || ''} 
                onChange={(e) => setDashboardProfile((prev) => ({ ...prev, portfolio: e.target.value }))}
                placeholder="https://yourportfolio.com" 
                style={{ marginTop: '8px', width: '100%' }} 
              />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              LinkedIn URL
              <input 
                type="url" 
                value={dashboardProfile.linkedin || ''} 
                onChange={(e) => setDashboardProfile((prev) => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/username" 
                style={{ marginTop: '8px', width: '100%' }} 
              />
            </label>
            <label>
              GitHub URL
              <input 
                type="url" 
                value={dashboardProfile.github || ''} 
                onChange={(e) => setDashboardProfile((prev) => ({ ...prev, github: e.target.value }))}
                placeholder="https://github.com/username" 
                style={{ marginTop: '8px', width: '100%' }} 
              />
            </label>
          </div>
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }}></div>
          
          <h3>Change Password</h3>
          <label>
            Current Password
            <input 
              type="password" 
              value={dashboardPassword.current} 
              onChange={(e) => setDashboardPassword((p) => ({ ...p, current: e.target.value }))} 
              style={{ marginTop: '8px' }} 
            />
          </label>
          <label>
            New Password
            <input 
              type="password" 
              value={dashboardPassword.new} 
              onChange={(e) => setDashboardPassword((p) => ({ ...p, new: e.target.value }))} 
              style={{ marginTop: '8px' }} 
            />
          </label>
          <label>
            Confirm New Password
            <input 
              type="password" 
              value={dashboardPassword.confirm} 
              onChange={(e) => setDashboardPassword((p) => ({ ...p, confirm: e.target.value }))} 
              style={{ marginTop: '8px' }} 
            />
          </label>
          <button 
            type="submit" 
            className="button button-primary" 
            onClick={() => {
              if (dashboardPassword.new || dashboardPassword.current || dashboardPassword.confirm) {
                if (!dashboardPassword.new) {
                  window.alert('Enter a new password');
                  return;
                }
                if (dashboardPassword.new !== dashboardPassword.confirm) {
                  window.alert('Passwords do not match');
                  return;
                }
                setDashboardPassword({ current: '', new: '', confirm: '' });
              }
            }}
            style={{ marginTop: '16px', alignSelf: 'flex-start' }}
          >
            Save Changes
          </button>
        </form>
      </div>
    </section>
  )
}
