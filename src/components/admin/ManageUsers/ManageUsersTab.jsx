import { useState } from 'react';

export default function AdminManageUsers({ users, setUsers, activities, projects }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [openBadgeDropdownId, setOpenBadgeDropdownId] = useState(null);

  const AVAILABLE_BADGES = ['Top Performer', 'Innovator', 'Full Stack Developer', 'Active Contributor', 'Hackathon Winner', 'Problem Solver', 'Consistent Learner', 'Team Player'];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleReviewer = (id, currentStatus) => {
    setUsers(users.map(u => u.id === id ? { ...u, isReviewer: !currentStatus } : u));
  };

  const removeUser = (id) => {
    if(window.confirm('Are you sure you want to remove this account?')) {
      setUsers(users.filter(u => u.id !== id));
      if (selectedUser && selectedUser.id === id) setSelectedUser(null);
    }
  };

  if (selectedUser) {
    const userEmail = selectedUser.email || `${selectedUser.name.toLowerCase().replace(' ', '.')}@vitstudent.ac.in`;
    const userRegNo = selectedUser.registerNumber || `21BCE${1000 + (selectedUser.id % 9000)}`;
    const userPhone = selectedUser.phoneNumber || `+91 98765 ${43210 + (selectedUser.id % 1000)}`;
    const userDept = selectedUser.department || 'Computer Science & Engineering';
    const userLinkedin = `linkedin.com/in/${selectedUser.name.replace(/\s+/g, '').toLowerCase()}`;
    const userGithub = selectedUser.github || `github.com/${selectedUser.name.replace(/\s+/g, '').toLowerCase()}`;
    const userPortfolio = selectedUser.portfolio || `${selectedUser.name.replace(/\s+/g, '').toLowerCase()}.dev`;
    
    // Sort users by totalScore to calculate live rank
    const sortedLeaderboard = [...users].sort((a, b) => b.totalScore - a.totalScore);
    const resolvedRank = sortedLeaderboard.findIndex(u => u.id === selectedUser.id) + 1;
    const userLeaderboardPosition = resolvedRank > 0 ? `#${resolvedRank}` : 'N/A';

    // Find actual projects owner by selected user
    const userProjects = projects ? projects.filter(p => p.owner === selectedUser.name) : [];

    // Find actual reviews left by this user
    const userEvaluations = [];
    if (projects) {
      projects.forEach(p => {
        if (p.individualRatings) {
          const ratingObj = p.individualRatings.find(r => r.user === selectedUser.name);
          if (ratingObj) {
            userEvaluations.push({
              id: p.id,
              project: p.title,
              givenRating: ratingObj.rating,
              feedback: ratingObj.comment
            });
          }
        }
      });
    }

    return (
      <section className="panel-section">
        <div className="section-head" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <button 
              className="button button-outlined" 
              style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              onClick={() => setSelectedUser(null)}
            >
              <span>←</span> Back to Manage Users
            </button>
            <h2>Member Profile: {selectedUser.name}</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="button button-primary" 
              onClick={() => toggleReviewer(selectedUser.id, selectedUser.isReviewer)}
            >
              {selectedUser.isReviewer ? 'Revoke Reviewer Access' : 'Make Reviewer'}
            </button>
            <button 
              className="button button-outlined" 
              style={{ color: '#ff5555', borderColor: '#ff5555' }}
              onClick={() => removeUser(selectedUser.id)}
            >
              Delete Account
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="panel-card" style={{ padding: '32px', position: 'relative' }}>
              <button
                type="button"
                className={`button ${isEditingProfile ? 'button-primary' : 'button-outlined'}`}
                style={{ position: 'absolute', top: '24px', right: '24px', padding: '6px 16px', zIndex: 10 }}
                onClick={() => {
                  if (isEditingProfile) {
                    setIsEditingProfile(false);
                    alert('Profile details successfully updated (mocked).');
                  } else {
                    setEditForm({
                      name: selectedUser.name,
                      email: userEmail,
                      regNo: userRegNo,
                      dept: userDept,
                      phone: userPhone,
                      portfolio: userPortfolio,
                      linkedin: userLinkedin,
                      github: userGithub
                    });
                    setIsEditingProfile(true);
                  }
                }}
              >
                {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
              </button>
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="avatar-wrap" style={{ margin: 0, padding: 0 }}>
                    <div className="avatar" style={{ width: '64px', height: '64px' }}>
                      <span className="avatar-initial" style={{ fontSize: '24px' }}>{isEditingProfile && editForm.name ? editForm.name.charAt(0) : selectedUser.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
                    {isEditingProfile ? (
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ fontSize: '1.1rem', fontWeight: 'bold', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }} />
                    ) : (
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedUser.name}</h3>
                    )}
                    {isEditingProfile ? (
                      <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }} />
                    ) : (
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{userEmail}</p>
                    )}
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="eyebrow" style={{ margin: 0 }}>Role: {selectedUser.role}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 8px', background: 'rgba(255, 85, 85, 0.1)', color: '#ff5555', borderRadius: '4px', border: '1px solid rgba(255, 85, 85, 0.2)' }}>
                      Reviewer Access: {selectedUser.isReviewer ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedUser.badges && selectedUser.badges.length > 0 ? selectedUser.badges.map(b => (
                      <span key={b} className="pill" style={{ background: 'rgba(255,255,255,0.1)' }}>{b}</span>
                    )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No badges earned yet.</span>}
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '8px 0' }}></div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label>
                    Register Number
                    <input type="text" value={isEditingProfile ? editForm.regNo : userRegNo} onChange={e => setEditForm({...editForm, regNo: e.target.value})} readOnly={!isEditingProfile} style={{ marginTop: '8px', width: '100%', opacity: isEditingProfile ? 1 : 0.7, cursor: isEditingProfile ? 'text' : 'not-allowed' }} />
                  </label>
                  <label>
                    Department
                    <input type="text" value={isEditingProfile ? editForm.dept : userDept} onChange={e => setEditForm({...editForm, dept: e.target.value})} readOnly={!isEditingProfile} style={{ marginTop: '8px', width: '100%', opacity: isEditingProfile ? 1 : 0.7, cursor: isEditingProfile ? 'text' : 'not-allowed' }} />
                  </label>
                  <label>
                    Phone Number
                    <input type="tel" value={isEditingProfile ? editForm.phone : userPhone} onChange={e => setEditForm({...editForm, phone: e.target.value})} readOnly={!isEditingProfile} style={{ marginTop: '8px', width: '100%', opacity: isEditingProfile ? 1 : 0.7, cursor: isEditingProfile ? 'text' : 'not-allowed' }} />
                  </label>
                  <label>
                    Personal Portfolio
                    <input type="url" value={isEditingProfile ? editForm.portfolio : userPortfolio} onChange={e => setEditForm({...editForm, portfolio: e.target.value})} readOnly={!isEditingProfile} style={{ marginTop: '8px', width: '100%', opacity: isEditingProfile ? 1 : 0.7, cursor: isEditingProfile ? 'text' : 'not-allowed' }} />
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <label>
                    LinkedIn URL
                    <input type="url" value={isEditingProfile ? editForm.linkedin : userLinkedin} onChange={e => setEditForm({...editForm, linkedin: e.target.value})} readOnly={!isEditingProfile} style={{ marginTop: '8px', width: '100%', opacity: isEditingProfile ? 1 : 0.7, cursor: isEditingProfile ? 'text' : 'not-allowed' }} />
                  </label>
                  <label>
                    GitHub URL
                    <input type="url" value={isEditingProfile ? editForm.github : userGithub} onChange={e => setEditForm({...editForm, github: e.target.value})} readOnly={!isEditingProfile} style={{ marginTop: '8px', width: '100%', opacity: isEditingProfile ? 1 : 0.7, cursor: isEditingProfile ? 'text' : 'not-allowed' }} />
                  </label>
                </div>
              </form>
            </div>

            <div className="panel-card">
              <p className="eyebrow">Recent Activity</p>
              <div className="activity-list" style={{ marginTop: '16px' }}>
                {activities?.map((item) => (
                  <div key={item.label} className="activity-item">
                    <div>
                      <strong>{item.label}</strong>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.detail}</p>
                    </div>
                    <span>{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="panel-card">
                <p className="eyebrow">Total Score</p>
                <h3>{selectedUser.totalScore}</h3>
              </div>
              <div className="panel-card">
                <p className="eyebrow">Projects Uploaded</p>
                <h3>{userProjects.length}</h3>
              </div>
              <div className="panel-card">
                <p className="eyebrow">Leaderboard Pos.</p>
                <h3>{userLeaderboardPosition}</h3>
              </div>
            </div>

            <div className="panel-card">
              <p className="eyebrow">Submitted Projects</p>
              <div className="activity-list" style={{ marginTop: '16px' }}>
                {userProjects.length > 0 ? userProjects.map((proj) => (
                  <div key={proj.id} className="activity-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>{proj.title}</strong>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status: {proj.status} • Rating: {proj.rating}</p>
                    </div>
                  </div>
                )) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No projects submitted yet.</p>}
              </div>
            </div>

            <div className="panel-card">
              <p className="eyebrow">Submitted Evaluations</p>
              <div className="activity-list" style={{ marginTop: '16px' }}>
                {userEvaluations.length > 0 ? userEvaluations.map((evalItem) => (
                  <div key={evalItem.id} className="activity-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '12px' }}>
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>{evalItem.project}</strong>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Given Rating: {evalItem.givenRating}/10</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>"{evalItem.feedback}"</p>
                    </div>
                  </div>
                )) : <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>No evaluations submitted yet.</p>}
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="panel-section">
      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          animation: fadeIn 0.2s ease-out;
        }

        .modal-content {
          background: linear-gradient(145deg, rgba(25, 3, 3, 0.95), rgba(12, 1, 1, 0.98));
          border: 1px solid rgba(208, 125, 34, 0.3);
          border-radius: 24px;
          width: min(480px, 90vw);
          padding: 32px;
          box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          animation: slideUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 16px;
        }

        .modal-header h2 {
          font-size: 1.4rem;
          margin: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
          transition: color 0.2s;
          padding: 0;
          margin-top: -6px;
        }

        .close-btn:hover {
          color: #ff5555;
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="eyebrow" style={{ margin: 0 }}>Manage Users & Reviewers</p>
          <button className="button button-secondary" onClick={() => setShowInviteModal(true)}>Invite Member</button>
        </div>
        <div className="search-box" style={{ width: '100%', boxSizing: 'border-box' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, marginTop: '2px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>
      
      <div className="table-card" style={{ overflow: 'visible' }}>
        <div className="table-row table-head" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 200px 150px', gap: '16px' }}>
          <div>Name</div>
          <div>Role</div>
          <div>Status</div>
          <div>Reviewer Access</div>
          <div>Badges</div>
          <div>Actions</div>
        </div>
        {filteredUsers.map((user) => (
          <div key={user.id} className="table-row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 200px 150px', gap: '16px', alignItems: 'center', position: 'relative', zIndex: openBadgeDropdownId === user.id ? 10 : 1 }}>
            <div 
              style={{ cursor: 'pointer', color: '#ffffff', fontWeight: 'bold' }}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </div>
            <div>
              <select 
                value={user.role} 
                onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, role: e.target.value } : u))}
                style={{ 
                  background: 'transparent', 
                  color: 'var(--text)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px', 
                  padding: '6px 12px',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                <option style={{ background: 'rgba(18, 2, 2, 0.98)' }}>Admin</option>
                <option style={{ background: 'rgba(18, 2, 2, 0.98)' }}>Member</option>
                <option style={{ background: 'rgba(18, 2, 2, 0.98)' }}>Lead</option>
                <option style={{ background: 'rgba(18, 2, 2, 0.98)' }}>Vice Chairperson</option>
                <option style={{ background: 'rgba(18, 2, 2, 0.98)' }}>Secretary</option>
                <option style={{ background: 'rgba(18, 2, 2, 0.98)' }}>Co Secretary</option>
              </select>
            </div>
            <div><span className={`status-pill status-${user.status.toLowerCase()}`}>{user.status}</span></div>
            <div>
              <span className={`status-pill status-${user.isReviewer ? 'approved' : 'pending'}`}>
                {user.isReviewer ? 'Yes' : 'No'}
              </span>
            </div>
            <div 
              style={{ position: 'relative', zIndex: openBadgeDropdownId === user.id ? 999 : 1 }}
              onMouseLeave={() => setOpenBadgeDropdownId(null)}
            >
              <button 
                className="button button-outlined" 
                style={{ width: '100%', justifyContent: 'space-between', padding: '6px 12px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.02)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenBadgeDropdownId(openBadgeDropdownId === user.id ? null : user.id);
                }}
              >
                <span>{user.badges && user.badges.length > 0 ? `${user.badges.length} selected` : 'Select Badges'}</span>
                <span style={{ fontSize: '0.7rem' }}>▼</span>
              </button>
              {openBadgeDropdownId === user.id && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, paddingTop: '4px', zIndex: 9999 }}>
                  <div 
                    style={{
                      background: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      padding: '8px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      maxHeight: '150px',
                      overflowY: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {AVAILABLE_BADGES.map(badge => {
                      const isSelected = user.badges?.includes(badge);
                      return (
                        <label key={badge} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', padding: '4px', borderRadius: '4px', background: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#fff' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => {
                              let newBadges = user.badges || [];
                              if (e.target.checked) {
                                newBadges = [...newBadges, badge];
                              } else {
                                newBadges = newBadges.filter(b => b !== badge);
                              }
                              setUsers(users.map(u => u.id === user.id ? { ...u, badges: newBadges } : u));
                            }}
                          />
                          {badge}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button 
                className="button button-outlined" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }}
                onClick={() => toggleReviewer(user.id, user.isReviewer)}
              >
                {user.isReviewer ? 'Demote' : 'Promote'}
              </button>
              <button 
                className="button button-outlined" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff5555', borderColor: '#ff5555', flex: 1 }} 
                onClick={() => removeUser(user.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>



      {showInviteModal && (
        <div className="modal-backdrop" onClick={() => setShowInviteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite New Member</h2>
              <button className="close-btn" onClick={() => setShowInviteModal(false)}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label>
                Email Address
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="new.member@example.com" 
                  style={{ marginTop: '8px' }}
                />
              </label>
              <label>
                Initial Role
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{ marginTop: '8px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', color: 'var(--text)' }}>
                  <option>Admin</option>
                  <option>Member</option>
                  <option>Lead</option>
                  <option>Vice Chairperson</option>
                  <option>Secretary</option>
                  <option>Co Secretary</option>
                </select>
              </label>
              <button 
                className="button button-primary" 
                style={{ marginTop: '16px' }}
                onClick={() => {
                  if (!inviteEmail) return window.alert('Please enter an email address.');
                  const namePrefix = inviteEmail.split('@')[0];
                  const newUserName = namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1);
                  setUsers([{ 
                    id: Date.now(), 
                    name: newUserName, 
                    role: inviteRole, 
                    status: 'Pending', 
                    isReviewer: false, 
                    totalScore: 0, 
                    projectsUploaded: 0, 
                    averageRating: '0.0', 
                    badges: [],
                    projectRatingScore: 0,
                    contributionScore: 0
                  }, ...users]);
                  setInviteEmail('');
                  setInviteRole('Member');
                  setShowInviteModal(false);
                  window.alert(`Invitation sent to ${inviteEmail}!`);
                }}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
