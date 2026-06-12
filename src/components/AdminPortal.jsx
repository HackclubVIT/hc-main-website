import { useState, useMemo } from 'react'
import Leaderboard from '../Leaderboard/Leaderboard'
import { navItems } from '../data/mockData'

import ManageUsersTab from './admin/ManageUsers/ManageUsersTab'
import ManageProjectsTab from './admin/ManageProjects/ManageProjectsTab'
import ApproveUploadsTab from './admin/ApproveUploads/ApproveUploadsTab'
import RatingsManagementTab from './admin/RatingsManagement/RatingsManagementTab'
import LeaderboardManagementTab from './admin/LeaderboardManagement/LeaderboardManagementTab'
import AnalyticsTab from './admin/Analytics/AnalyticsTab'
import AnnouncementsTab from './admin/Announcements/AnnouncementsTab'
import FeedbackTab from './admin/Feedback/FeedbackTab'
import ModerationTab from './admin/Moderation/ModerationTab'
import SystemTab from './admin/System/SystemTab'
import ProfileTab from './admin/Profile/ProfileTab'
import DashboardTab from './admin/Dashboard/DashboardTab'

export default function AdminPortal({ 
  onLogout, 
  globalAnnouncements, 
  setGlobalAnnouncements, 
  readAnnouncementsCount, 
  setReadAnnouncementsCount, 
  globalUsers, 
  setGlobalUsers,
  globalProjects,
  setGlobalProjects,
  globalUploads,
  setGlobalUploads,
  globalSystemStatus,
  globalFeedbacks,
  globalActivities,
  globalWeeklyWinners,
  setGlobalWeeklyWinners,
  globalMonthlyWinners
}) {
  const [activeSection, setActiveSection] = useState('Dashboard')

  // UI state
  const [isAdminSidebarMinimized, setIsAdminSidebarMinimized] = useState(false)
  const [showAdminProfileDropdown, setShowAdminProfileDropdown] = useState(false)
  const [showBugReport, setShowBugReport] = useState(false)
  const [bugReport, setBugReport] = useState({ title: '', description: '' })

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case 'Manage Users':
        return <ManageUsersTab users={globalUsers} setUsers={setGlobalUsers} activities={globalActivities} />
      case 'Manage Projects':
        return <ManageProjectsTab projects={globalProjects} setProjects={setGlobalProjects} />
      case 'Approve Uploads':
        return <ApproveUploadsTab uploads={globalUploads} setUploads={setGlobalUploads} />
      case 'Ratings Management':
        return <RatingsManagementTab projects={globalProjects} setProjects={setGlobalProjects} />
      case 'Leaderboard Management':
        return <LeaderboardManagementTab 
                  users={globalUsers} 
                  setUsers={setGlobalUsers}
                  projects={globalProjects}
                  weeklyWinners={globalWeeklyWinners}
                  setWeeklyWinners={setGlobalWeeklyWinners}
                  addAnnouncement={(ann) => setGlobalAnnouncements([ann, ...globalAnnouncements])} 
               />
      case 'Analytics':
        return <AnalyticsTab users={globalUsers} projects={globalProjects} />
      case 'Announcements':
        return <AnnouncementsTab announcements={globalAnnouncements} setAnnouncements={setGlobalAnnouncements} addAnnouncement={(ann) => setGlobalAnnouncements([ann, ...globalAnnouncements])} />
      case 'Leaderboard':
        return <Leaderboard users={globalUsers} projects={globalProjects} weeklyWinners={globalWeeklyWinners} monthlyWinners={globalMonthlyWinners} />
      case 'Feedback':
        return <FeedbackTab feedbacks={globalFeedbacks} />
      case 'Moderation':
        return <ModerationTab />
      case 'System':
        return <SystemTab adminSystemStatus={globalSystemStatus} />
      case 'Profile':
        return <ProfileTab />
      default:
        return <DashboardTab adminUploads={globalUploads} globalAnnouncements={globalAnnouncements} />
    }
  }, [
    activeSection,
    globalUsers,
    globalProjects,
    globalUploads,
    globalAnnouncements,
    setGlobalAnnouncements,
    globalSystemStatus,
    globalFeedbacks,
    globalActivities,
    globalWeeklyWinners,
    globalMonthlyWinners,
    setGlobalProjects,
    setGlobalUploads,
    setGlobalUsers,
    setGlobalWeeklyWinners
  ])

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${isAdminSidebarMinimized ? 'minimized' : ''}`}>
        <div className="sidebar-brand" style={isAdminSidebarMinimized ? { display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' } : { display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div 
              className="brand-mark sidebar-mark" 
              style={isAdminSidebarMinimized ? { width: 40, height: 40, fontSize: '1.2rem', margin: '0' } : {}}
              title={isAdminSidebarMinimized ? "HackClub VIT Chennai" : ""}
            >
              h.
            </div>
            {!isAdminSidebarMinimized && (
              <div>
                <p>HackClub</p>
                <span>VIT Chennai</span>
              </div>
            )}
          </div>
          <button className="toggle-sidebar-btn" onClick={() => setIsAdminSidebarMinimized(!isAdminSidebarMinimized)}>
            {isAdminSidebarMinimized ? '▶' : '◀'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-link ${activeSection === item ? 'active' : ''}`}
              onClick={() => {
                setActiveSection(item);
                if (item === 'Announcements') {
                  setReadAnnouncementsCount(globalAnnouncements.length);
                }
              }}
              title={item}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span>{isAdminSidebarMinimized ? item.charAt(0) : item}</span>
              {item === 'Announcements' && globalAnnouncements.length > readAnnouncementsCount && (
                <span style={{ 
                  background: '#ff5555', color: 'white', borderRadius: '12px', padding: '2px 6px', 
                  fontSize: '11px', fontWeight: 'bold', minWidth: '18px', textAlign: 'center', lineHeight: 1
                }}>
                  {globalAnnouncements.length - readAnnouncementsCount}
                </span>
              )}
            </button>
          ))}
          {/* Inject Leaderboard Management into nav if not in mockData */}
          {!navItems.includes('Leaderboard Management') && (
            <button
              className={`nav-link ${activeSection === 'Leaderboard Management' ? 'active' : ''}`}
              onClick={() => setActiveSection('Leaderboard Management')}
              title="Leaderboard Management"
            >
              {isAdminSidebarMinimized ? 'L' : 'Leaderboard Management'}
            </button>
          )}
        </nav>
        <div className="sidebar-footer">
          {isAdminSidebarMinimized ? (
            <span title="System status: Online" style={{ fontSize: '20px', textAlign: 'center', width: '100%' }}>🟢</span>
          ) : (
            <>
              <p>System status</p>
              <span>Online</span>
            </>
          )}
        </div>
      </aside>
      <div className="admin-layout">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div>
              <p className="eyebrow">Admin Portal {activeSection !== 'Dashboard' ? `• ${activeSection}` : ''}</p>
              <h1>Welcome back, Admin</h1>
            </div>
          </div>
          <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="button button-secondary" type="button" onClick={() => setActiveSection('Dashboard')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏠</span> Home
            </button>
            <div style={{ position: 'relative' }} onMouseLeave={() => setShowAdminProfileDropdown(false)}>
              <div 
                className="profile-dropdown-trigger" 
                onClick={() => setShowAdminProfileDropdown(!showAdminProfileDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="avatar" style={{ width: '32px', height: '32px' }}>
                  <span className="avatar-initial" style={{ fontSize: '16px' }}>A</span>
                </div>
                <span style={{ fontWeight: '500' }}>Admin</span>
                <span style={{ fontSize: '12px' }}>▼</span>
              </div>
              {showAdminProfileDropdown && (
                <div style={{ position: 'absolute', top: '100%', right: '0', paddingTop: '8px', zIndex: 9999, minWidth: '180px' }}>
                  <div className="profile-dropdown-menu" style={{ background: 'rgba(18, 2, 2, 0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => { setActiveSection('Profile'); setShowAdminProfileDropdown(false); }}>Edit Profile</button>

                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => { setShowBugReport(true); setShowAdminProfileDropdown(false); }}>Report a Bug</button>
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
                <form onSubmit={(e) => {
                  e.preventDefault()
                  window.alert(`Bug reported: ${bugReport.title}`)
                  setBugReport({ title: '', description: '' })
                  setShowBugReport(false)
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
