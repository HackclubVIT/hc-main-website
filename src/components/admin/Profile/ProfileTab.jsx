export default function ProfileTab({ dashboardProfile = {}, setDashboardProfile = () => {} }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">{dashboardProfile.role || 'Admin'} Settings</p>
          <h2>Edit Your Profile</h2>
        </div>
      </div>
      <div className="panel-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          window.alert('Profile changes saved.');
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
            <div className="avatar" style={{ width: '64px', height: '64px' }}>
              {dashboardProfile.avatar && dashboardProfile.avatar.startsWith('emoji:') ? (
                <span className="avatar-emoji" style={{ fontSize: '24px' }}>{dashboardProfile.avatar.replace('emoji:', '')}</span>
              ) : dashboardProfile.avatar ? (
                <img src={dashboardProfile.avatar} alt="avatar" />
              ) : (
                <span className="avatar-initial" style={{ fontSize: '24px' }}>{dashboardProfile.name ? dashboardProfile.name.charAt(0) : 'A'}</span>
              )}
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
                <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:🧑‍💼' }))} className="avatar-option">🧑‍💼</button>
                <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:🚀' }))} className="avatar-option">🚀</button>
                <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:✨' }))} className="avatar-option">✨</button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span className="eyebrow" style={{ margin: 0 }}>Role: {dashboardProfile.role || 'Admin'}</span>
          </div>

          <label>
            Display Name
            <input
              type="text"
              value={dashboardProfile.name || ''}
              onChange={(e) => setDashboardProfile((prev) => ({ ...prev, name: e.target.value }))}
              style={{ marginTop: '8px' }}
            />
          </label>
          <label>
            Email Address
            <input
              type="email"
              value={dashboardProfile.email || ''}
              readOnly
              style={{ marginTop: '8px', opacity: 0.7, cursor: 'not-allowed' }}
            />
          </label>
          <div className="two-col-grid">
            <label>
              Register Number
              <input
                type="text"
                value={dashboardProfile.registerNumber || ''}
                onChange={(e) => setDashboardProfile((prev) => ({ ...prev, registerNumber: e.target.value }))}
                placeholder="e.g. 21BCE1234"
                style={{ marginTop: '8px', width: '100%' }}
              />
            </label>
            <label>
              Phone Number
              <input
                type="tel"
                value={dashboardProfile.phoneNumber || ''}
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
          <div className="two-col-grid">
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
            <input type="password" style={{ marginTop: '8px' }} />
          </label>
          <label>
            New Password
            <input type="password" style={{ marginTop: '8px' }} />
          </label>
          <button type="submit" className="button button-primary" style={{ marginTop: '16px', alignSelf: 'flex-start' }}>Save Changes</button>
        </form>
      </div>
    </section>
  )
}
