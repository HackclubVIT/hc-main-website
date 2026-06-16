import { useState } from 'react'
import Leaderboard from '../Leaderboard/Leaderboard'
import OverviewTab from './user/Overview/OverviewTab'
import ProfileTab from './user/Profile/ProfileTab'
import ProjectsTab from './user/Projects/ProjectsTab'
import EvaluateTab from './user/Evaluate/EvaluateTab'
import ActivityTab from './user/Activity/ActivityTab'
import AnalyticsTab from './user/Analytics/AnalyticsTab'
import TeamTab from './user/Team/TeamTab'
import UpdatesTab from './user/Updates/UpdatesTab'
import NotificationsTab from './user/Notifications/NotificationsTab'
import EventsTab from './user/Events/EventsTab'
import { useNavigate } from 'react-router-dom'
import ProjectsPage from '../pages/projects/ProjectsPage'

export default function UserPortal({ 
  onLogout, 
  globalAnnouncements,
  readAnnouncementsCount,
  setReadAnnouncementsCount,
  globalUsers,
  globalProjects,
  setGlobalProjects,
  setGlobalUploads,
  globalActivities,
  setGlobalActivities,
  globalEvents,
  setGlobalEvents,
  globalTeamUpdates,
  setGlobalTeamUpdates,
  globalFeedbacks,
  setGlobalFeedbacks,
  globalAnalytics,
  globalWeeklyWinners,
  globalMonthlyWinners,
  globalProfile,
  setGlobalProfile,
  globalContributions,
  setGlobalContributions
}) {
  const [userSection, setUserSection] = useState('overview')
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactData, setContactData] = useState({ email: '', subject: '', message: '' })

  const [dashboardPassword, setDashboardPassword] = useState({ current: '', new: '', confirm: '' })
  
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showBugReport, setShowBugReport] = useState(false)
  const [bugReport, setBugReport] = useState({ title: '', description: '' })
  
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', description: '', github: '', deployment: '', status: 'Pending', owner: 'Priya Sharma', rating: '0.0' })
  const navigate = useNavigate()
  const sectionContent = (() => {
    switch (userSection) {
      case 'overview':
        return <OverviewTab dashboardContributions={globalContributions} setDashboardContributions={setGlobalContributions} dashboardProjects={globalProjects} setDashboardProjects={setGlobalProjects} dashboardActivities={globalActivities} setDashboardActivities={setGlobalActivities} />
      case 'profile':
        return <ProfileTab dashboardProfile={globalProfile} setDashboardProfile={setGlobalProfile} dashboardPassword={dashboardPassword} setDashboardPassword={setDashboardPassword} />
      case 'projects':
        return <ProjectsTab dashboardProjects={globalProjects} setDashboardProjects={setGlobalProjects} setGlobalUploads={setGlobalUploads} showAddProject={showAddProject} setShowAddProject={setShowAddProject} newProject={newProject} setNewProject={setNewProject} globalProfile={globalProfile} />
      case 'evaluate':
        return <EvaluateTab dashboardProjects={globalProjects} setDashboardProjects={setGlobalProjects} />
      case 'activity':
        return <ActivityTab dashboardActivities={globalActivities} setDashboardActivities={setGlobalActivities} />
      case 'analytics':
        return <AnalyticsTab dashboardAnalytics={globalAnalytics} setDashboardAnalytics={() => {}} />
      case 'leaderboard':
        return <Leaderboard users={globalUsers} projects={globalProjects} weeklyWinners={globalWeeklyWinners} monthlyWinners={globalMonthlyWinners} />
      case 'team':
        return <TeamTab dashboardTeamUpdates={globalTeamUpdates} setDashboardTeamUpdates={setGlobalTeamUpdates} />
      case 'updates':
        return <UpdatesTab globalAnnouncements={globalAnnouncements} />
      case 'notifications':
        return <NotificationsTab globalAnnouncements={globalAnnouncements} />
      case 'events':
      default:
        return <EventsTab dashboardEvents={globalEvents} setDashboardEvents={setGlobalEvents} />
    }
  })();

  return (
    <div className="user-shell">
      <aside className={`user-sidebar ${isSidebarMinimized ? 'minimized' : ''}`}>
        <div className="sidebar-brand" style={isSidebarMinimized ? { display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' } : { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div 
              className="brand-mark sidebar-mark" 
              style={isSidebarMinimized ? { width: 40, height: 40, fontSize: '1.2rem', margin: '0' } : {}}
              title={isSidebarMinimized ? "HackClub VIT Chennai" : ""}
            >
              h.
            </div>
            {!isSidebarMinimized && (
              <div>
                <p>HackClub</p>
                <span>VIT Chennai</span>
              </div>
            )}
          </div>
          <button className="toggle-sidebar-btn" onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}>
            {isSidebarMinimized ? '▶' : '◀'}
          </button>
        </div>
        <nav className="user-sidebar-nav">
          <div className="nav-section">
            <button
              className={`nav-link ${userSection === 'overview' ? 'active' : ''}`}
              onClick={() => setUserSection('overview')}
              title="Dashboard"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>
            <button
              className={`nav-link ${userSection === 'profile' ? 'active' : ''}`}
              onClick={() => setUserSection('profile')}
              title="My Profile"
            >
              <span>👤</span>
              <span>My Profile</span>
            </button>
          </div>
          <div className="nav-section">
            <button
              className={`nav-link ${userSection === 'projects' ? 'active' : ''}`}
              onClick={() => navigate('/projects')}
              title="My Projects"
            >
              <span>📁</span>
              <span>My Projects</span>
            </button>
            {globalProfile.isReviewer && (
              <button
                className={`nav-link ${userSection === 'evaluate' ? 'active' : ''}`}
                onClick={() => setUserSection('evaluate')}
                title="Evaluate Projects"
              >
                <span>⭐</span>
                <span>Evaluate Projects</span>
              </button>
            )}
            <button
              className={`nav-link ${userSection === 'activity' ? 'active' : ''}`}
              onClick={() => setUserSection('activity')}
              title="Activity"
            >
              <span>⚡</span>
              <span>Activity</span>
            </button>
            <button
              className={`nav-link ${userSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setUserSection('analytics')}
              title="Analytics"
            >
              <span>📈</span>
              <span>Analytics</span>
            </button>
          </div>
          <div className="nav-section">
            <button
              className={`nav-link ${userSection === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setUserSection('leaderboard')}
              title="Leaderboard"
            >
              <span>🏆</span>
              <span>Leaderboard</span>
            </button>
            <button
              className={`nav-link ${userSection === 'team' ? 'active' : ''}`}
              onClick={() => setUserSection('team')}
              title="Team"
            >
              <span>👥</span>
              <span>Team</span>
            </button>
            <button
              className={`nav-link ${userSection === 'updates' ? 'active' : ''}`}
              onClick={() => {
                setUserSection('updates');
                setReadAnnouncementsCount(globalAnnouncements.length);
              }}
              title="Updates"
            >
              <span>📣</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Updates</span>
                {globalAnnouncements.length > readAnnouncementsCount && (
                  <span style={{ 
                    background: '#ff5555', color: 'white', borderRadius: '12px', padding: '2px 6px', 
                    fontSize: '11px', fontWeight: 'bold', minWidth: '18px', textAlign: 'center', lineHeight: 1
                  }}>
                    {globalAnnouncements.length - readAnnouncementsCount}
                  </span>
                )}
              </div>
            </button>
          </div>
          <div className="nav-section">
            <button
              className={`nav-link ${userSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setUserSection('notifications')}
              title="Notifications"
            >
              <span>🔔</span>
              <span>Notifications</span>
            </button>
            <button
              className={`nav-link ${userSection === 'events' ? 'active' : ''}`}
              onClick={() => setUserSection('events')}
              title="Events"
            >
              <span>📅</span>
              <span>Events</span>
            </button>
          </div>
        </nav>
      </aside>
      <div className="user-layout">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {globalProfile.isReviewer && (
              <span className="badge badge-primary">Reviewer</span>
            )}
            <div>
              <p className="eyebrow">User Dashboard</p>
              <h1>Welcome back, {globalProfile.name}</h1>
            </div>
          </div>
          <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="button button-secondary" type="button" onClick={() => setUserSection('overview')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏠</span> Home
            </button>
            <div style={{ position: 'relative' }} onMouseLeave={() => setShowProfileDropdown(false)}>
              <div 
                className="profile-dropdown-trigger" 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="avatar-circle" style={{ width: 32, height: 32 }}>
                  {globalProfile.avatar && globalProfile.avatar.startsWith('emoji:') ? (
                    <span className="avatar-emoji" style={{ fontSize: '18px' }}>{globalProfile.avatar.replace('emoji:', '')}</span>
                  ) : globalProfile.avatar ? (
                    <img src={globalProfile.avatar} alt="avatar" />
                  ) : (
                    <span className="avatar-initial" style={{ fontSize: '16px' }}>{globalProfile.name ? globalProfile.name.charAt(0) : 'U'}</span>
                  )}
                </div>
                <span style={{ fontWeight: '500' }}>{globalProfile.name}</span>
                <span style={{ fontSize: '12px' }}>▼</span>
              </div>
              {showProfileDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: '0', paddingTop: '8px', zIndex: 9999, minWidth: '180px' }}>
                  <div className="profile-dropdown-menu" style={{ background: 'rgba(18, 2, 2, 0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => { setUserSection('profile'); setShowProfileDropdown(false); }}>Edit Profile</button>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => { setShowBugReport(true); setShowProfileDropdown(false); }}>Report a Bug</button>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start', color: '#ff5555' }} onClick={onLogout}>Logout</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="admin-content">
          {showBugReport ? (
            <section className="panel-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <div className="panel-card" style={{ maxWidth: '500px', width: '100%', padding: '32px' }}>
                <div className="section-head" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '24px' }}>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <p className="eyebrow" style={{ color: '#ff5555' }}>Support</p>
                    <h2 style={{ fontSize: '24px', margin: '8px 0' }}>Report a Bug</h2>
                  </div>
                </div>
                <div style={{ marginTop: '24px' }}>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      setGlobalFeedbacks([{
                        id: Date.now(),
                        title: bugReport.title,
                        description: bugReport.description,
                        user: 'Priya Sharma',
                        date: new Date().toISOString().split('T')[0],
                        status: 'Open'
                      }, ...globalFeedbacks])
                      setBugReport({ title: '', description: '' })
                      setShowBugReport(false)
                      window.alert('Feedback submitted successfully!')
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label>
                    Issue Title
                    <input
                      type="text"
                      value={bugReport.title}
                      onChange={(e) => setBugReport((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="What went wrong?"
                      required
                      style={{ marginTop: '8px' }}
                    />
                  </label>
                  <label>
                    Description
                    <textarea
                      value={bugReport.description}
                      onChange={(e) => setBugReport((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Please describe the issue in detail..."
                      rows="6"
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
                        resize: 'vertical',
                      }}
                    />
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button className="button button-primary" type="submit" style={{ flex: 1, backgroundColor: '#ff5555', color: '#fff' }}>Submit Bug</button>
                    <button className="button button-secondary" type="button" onClick={() => setShowBugReport(false)} style={{ flex: 1 }}>Cancel</button>
                  </div>
                </form>
              </div>
              </div>
            </section>
          ) : showContactForm ? (
            <section className="panel-section">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Contact Us</p>
                  <h2>Get in touch with the HackClub team</h2>
                </div>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setShowContactForm(false)}
                >
                  Back
                </button>
              </div>
              <div className="panel-card" style={{ maxWidth: '500px' }}>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  window.alert(`Message sent: ${contactData.subject}`)
                  setContactData({ email: '', subject: '', message: '' })
                  setShowContactForm(false)
                }}>
                  <label>
                    Your Email
                    <input
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </label>
                  <label>
                    Subject
                    <input
                      type="text"
                      value={contactData.subject}
                      onChange={(e) => setContactData((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="How can we help?"
                      required
                    />
                  </label>
                  <label>
                    Message
                    <textarea
                      value={contactData.message}
                      onChange={(e) => setContactData((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us more..."
                      rows="6"
                      required
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        color: 'var(--text)',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        resize: 'vertical',
                      }}
                    />
                  </label>
                  <button className="button button-primary" type="submit">Send Message</button>
                </form>
              </div>
            </section>
          ) : (
            sectionContent
          )}
        </main>
        <footer className="app-footer" style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
          <button className="button button-outlined" type="button" onClick={() => setShowBugReport(true)}>Report a Bug</button>
        </footer>
      </div>
    </div>
  )
}
