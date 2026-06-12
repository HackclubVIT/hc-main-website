export default function ProfileTab() {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Admin Settings</p>
          <h2>Edit Your Profile</h2>
        </div>
      </div>
      <div className="panel-card" style={{ maxWidth: '600px' }}>
        <form onSubmit={(e) => {
          e.preventDefault();
          window.alert('Profile updated successfully!');
        }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
            <div className="avatar" style={{ width: '64px', height: '64px' }}>
              <span className="avatar-initial" style={{ fontSize: '24px' }}>A</span>
            </div>
            <button type="button" className="button button-outlined">Change Avatar</button>
          </div>
          <label>
            Display Name
            <input type="text" defaultValue="Admin" style={{ marginTop: '8px' }} />
          </label>
          <label>
            Email Address
            <input type="email" defaultValue="admin@hackclubvitc.com" style={{ marginTop: '8px' }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              Register Number
              <input type="text" placeholder="e.g. 21BCE1234" style={{ marginTop: '8px', width: '100%' }} />
            </label>
            <label>
              Department
              <input type="text" placeholder="e.g. Computer Science" style={{ marginTop: '8px', width: '100%' }} />
            </label>
            <label>
              Phone Number
              <input type="tel" placeholder="e.g. +91 9876543210" style={{ marginTop: '8px', width: '100%' }} />
            </label>
            <label>
              Personal Portfolio
              <input type="url" placeholder="https://yourportfolio.com" style={{ marginTop: '8px', width: '100%' }} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label>
              LinkedIn URL
              <input type="url" placeholder="https://linkedin.com/in/username" style={{ marginTop: '8px', width: '100%' }} />
            </label>
            <label>
              GitHub URL
              <input type="url" placeholder="https://github.com/username" style={{ marginTop: '8px', width: '100%' }} />
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
