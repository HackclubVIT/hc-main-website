import { useEffect, useMemo, useState } from 'react'
import './App.css'
import HackClubLanding from './LandingPage.jsx'
import Leaderboard from './Leaderboard/Leaderboard'

const navItems = [
  'Overview',
  'Manage Users',
  'Manage Projects',
  'Approve Uploads',
  'Give Ratings',
  'Leaderboard',
  'Analytics',
  'Feedback',
  'Announcements',
  'Moderation',
  'System',
]

const stats = [
  { label: 'Active Users', value: '1,254' },
  { label: 'Projects', value: '432' },
  { label: 'Pending Uploads', value: '28' },
  { label: 'Avg. Rating', value: '4.8 / 5' },
]

const users = [
  { name: 'Ananya Rao', role: 'Moderator', status: 'Active' },
  { name: 'Rishi Kumar', role: 'Project Lead', status: 'Pending' },
  { name: 'Priya Menon', role: 'Content Admin', status: 'Active' },
  { name: 'Sahil Nair', role: 'Analytics', status: 'Inactive' },
]

const projects = [
  { title: 'Campus AI Mentor', owner: 'Ananya Rao', status: 'Review', rating: '4.7' },
  { title: 'VIT Hack Tracker', owner: 'Rishi Kumar', status: 'Published', rating: '4.9' },
  { title: 'Green Code Initiative', owner: 'Priya Menon', status: 'Draft', rating: '4.3' },
]

const uploads = [
  { content: 'HackClub event poster', author: 'Aditi Sharma', date: 'Jun 09', status: 'New' },
  { content: 'Team demo video', author: 'Hrithik Jain', date: 'Jun 08', status: 'Pending' },
  { content: 'Project report', author: 'Meera Pillai', date: 'Jun 07', status: 'New' },
]

const leaderboard = [
  { rank: 1, student: 'Nikhil Singh', points: 1560 },
  { rank: 2, student: 'Aarav Patel', points: 1420 },
  { rank: 3, student: 'Sana Reddy', points: 1330 },
  { rank: 4, student: 'Diya Sharma', points: 1210 },
]

const feedbacks = [
  { user: 'Lakshmi', message: 'Need a faster upload flow for large files.', type: 'Suggestion' },
  { user: 'Karan', message: 'Project approval notifications are very helpful.', type: 'Praise' },
  { user: 'Megha', message: 'Analytics should include weekly trends.', type: 'Request' },
]

const announcements = [
  { title: 'HackClub Meet', body: 'Weekly meetup scheduled for Friday at 5 PM.', label: 'Live' },
  { title: 'Project Deadline', body: 'Final project submissions close on Jun 20.', label: 'Urgent' },
]

const systemStatus = [
  { label: 'Database', value: 'Online' },
  { label: 'API', value: 'Stable' },
  { label: 'Storage', value: '92% Capacity' },
]

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [showSplash, setShowSplash] = useState(false)
  const [showSplashPhase, setShowSplashPhase] = useState(0)
  const [activeSection, setActiveSection] = useState('Overview')
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  useEffect(() => {
    if (!authenticated || !showSplash) return undefined

    const textTimer = window.setTimeout(() => {
      setShowSplashPhase(1)
    }, 400)

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false)
      setShowSplashPhase(0)
    }, 2200)

    return () => {
      window.clearTimeout(textTimer)
      window.clearTimeout(hideTimer)
    }
  }, [authenticated, showSplash])

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case 'Manage Users':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Manage Users</p>
                <h2>User directory and role control</h2>
              </div>
              <button className="button button-secondary">Invite new admin</button>
            </div>
            <div className="table-card">
              <div className="table-row table-head">
                <div>Name</div>
                <div>Role</div>
                <div>Status</div>
              </div>
              {users.map((user) => (
                <div key={user.name} className="table-row">
                  <div>{user.name}</div>
                  <div>{user.role}</div>
                  <div className={`status-pill status-${user.status.toLowerCase()}`}>{user.status}</div>
                </div>
              ))}
            </div>
          </section>
        )
      case 'Manage Projects':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Manage Projects</p>
                <h2>Project status, review, and publish control</h2>
              </div>
              <button className="button button-secondary">Create project</button>
            </div>
            <div className="table-card">
              <div className="table-row table-head">
                <div>Project</div>
                <div>Owner</div>
                <div>Status</div>
                <div>Rating</div>
              </div>
              {projects.map((project) => (
                <div key={project.title} className="table-row">
                  <div>{project.title}</div>
                  <div>{project.owner}</div>
                  <div>{project.status}</div>
                  <div>{project.rating}</div>
                </div>
              ))}
            </div>
          </section>
        )
      case 'Approve Uploads':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Approve / Reject Uploads</p>
                <h2>Review incoming content before publishing</h2>
              </div>
            </div>
            <div className="list-card">
              {uploads.map((item) => (
                <div key={item.content} className="list-item">
                  <div>
                    <strong>{item.content}</strong>
                    <p>{item.author} ┬╖ {item.date}</p>
                  </div>
                  <div className="list-actions">
                    <button className="button button-outlined">Reject</button>
                    <button className="button button-primary">Approve</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      case 'Give Ratings':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Give & Manage Ratings</p>
                <h2>Score projects and maintain quality metrics</h2>
              </div>
            </div>
            <div className="cards-grid">
              <div className="panel-card card-highlight">
                <p className="eyebrow">Average Score</p>
                <h3>4.8 / 5.0</h3>
                <p>Keep votes consistent across review committees.</p>
              </div>
              <div className="panel-card card-accent">
                <p className="eyebrow">Top rated</p>
                <strong>VIT Hack Tracker</strong>
                <p>Project performance is stable for the week.</p>
              </div>
            </div>
          </section>
        )
      case 'Leaderboard':
        return <Leaderboard />
      case 'Analytics':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">View Analytics</p>
                <h2>Track participation, uploads, and performance</h2>
              </div>
              <button className="button button-secondary">Export report</button>
            </div>
            <div className="cards-grid">
              <div className="panel-card">
                <p className="eyebrow">Weekly Active</p>
                <h3>78%</h3>
                <p>Consistent growth compared to last week.</p>
              </div>
              <div className="panel-card">
                <p className="eyebrow">Approval Rate</p>
                <h3>92%</h3>
                <p>Most uploads are being approved quickly.</p>
              </div>
              <div className="panel-card">
                <p className="eyebrow">Content Flags</p>
                <h3>6</h3>
                <p>Moderation queue trending downward.</p>
              </div>
            </div>
          </section>
        )
      case 'Feedback':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Feedback & Reports</p>
                <h2>Review submitted suggestions and bug reports</h2>
              </div>
            </div>
            <div className="list-card">
              {feedbacks.map((item) => (
                <div key={item.user} className="list-item">
                  <div>
                    <strong>{item.user}</strong>
                    <p>{item.message}</p>
                  </div>
                  <span className="status-pill status-info">{item.type}</span>
                </div>
              ))}
            </div>
          </section>
        )
      case 'Announcements':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Announcements / Notifications</p>
                <h2>Broadcast updates to the HackClub community</h2>
              </div>
              <button className="button button-secondary">Post update</button>
            </div>
            <div className="announcement-grid">
              {announcements.map((note) => (
                <div key={note.title} className="panel-card announcement-card">
                  <div className="pill">{note.label}</div>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case 'Moderation':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Content Moderation</p>
                <h2>Check reported items and enforce community standards</h2>
              </div>
            </div>
            <div className="cards-grid">
              <div className="panel-card">
                <p className="eyebrow">Reports Open</p>
                <h3>14</h3>
              </div>
              <div className="panel-card card-accent">
                <p className="eyebrow">Actions Taken</p>
                <h3>52</h3>
              </div>
            </div>
          </section>
        )
      case 'System':
        return (
          <section className="panel-section">
            <div className="section-head">
              <div>
                <p className="eyebrow">Database / System Management</p>
                <h2>Monitor uptime, backups, and system health</h2>
              </div>
            </div>
            <div className="cards-grid">
              {systemStatus.map((item) => (
                <div key={item.label} className="panel-card">
                  <p className="eyebrow">{item.label}</p>
                  <h3>{item.value}</h3>
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return (
          <>
            <section className="panel-section hero-panel">
              <div className="hero-copy">
                <p className="eyebrow">Dashboard Overview</p>
                <h2>HackClub VIT Chennai Admin Portal</h2>
                <p>Monitor projects, approve uploads, manage members, and keep community activity on track.</p>
              </div>
              <div className="hero-summary">
                {stats.map((item) => (
                  <div key={item.label} className="summary-pill">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
            <section className="panel-section">
              <div className="cards-grid">
                <div className="panel-card">
                  <p className="eyebrow">Live queue</p>
                  <h3>Upload tile</h3>
                  <p>28 pending uploads require review.</p>
                </div>
                <div className="panel-card card-accent">
                  <p className="eyebrow">Latest announcement</p>
                  <strong>HackClub Meet this Friday</strong>
                  <p>Prepare the hall and invite mentors.</p>
                </div>
              </div>
            </section>
          </>
        )
    }
  }, [activeSection])

  if (showLanding) {
    return <HackClubLanding onLogin={() => setShowLanding(false)} />
  }

  return (
    <div className="app-shell">
      {!authenticated ? (
        <div className="login-shell">
          <div className="login-panel">
            <div className="brand-mark">
              <span>h.</span>
            </div>
            <h1>HackClub VIT Chennai</h1>
            <p>Admin portal access for event, project, and community management.</p>
            <form onSubmit={(event) => {
              event.preventDefault()
              if (credentials.email && credentials.password) {
                setAuthenticated(true)
                setShowSplash(true)
              }
            }}>
              <label>
                Email address
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="admin@hackclubvit.in"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Enter password"
                />
              </label>
              <button className="button button-primary" type="submit">Sign In</button>
            </form>
          </div>
        </div>
      ) : showSplash ? (
        <div className="launch-screen">
          <div className="launch-card launch-inline">
            <div className="launch-logo">
              <span className="launch-main">h</span>
              <span className="launch-dot">.</span>
            </div>
            <div className={`launch-word ${showSplashPhase === 1 ? 'visible' : ''}`}>
              <span>a</span>
              <span>c</span>
              <span>k</span>
              <span>C</span>
              <span>l</span>
              <span>u</span>
              <span>b</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-shell">
          <aside className="admin-sidebar">
            <div className="sidebar-brand">
              <div className="brand-mark sidebar-mark">h.</div>
              <div>
                <p>HackClub</p>
                <span>VIT Chennai</span>
              </div>
            </div>
            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <button
                  key={item}
                  className={`nav-link ${activeSection === item ? 'active' : ''}`}
                  onClick={() => setActiveSection(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="sidebar-footer">
              <p>System status</p>
              <span>Online</span>
            </div>
          </aside>
          <div className="admin-layout">
            <header className="admin-header">
              <div>
                <p className="eyebrow">Admin Portal</p>
                <h1>{activeSection}</h1>
              </div>
              <div className="header-actions">
                <div className="search-box">
                  <span>🔍</span>
                  <input type="text" placeholder="Search admin tools..." />
                </div>
                <button className="button button-outlined">Reports</button>
                <button
                  className="button button-secondary"
                  onClick={() => {
                    setAuthenticated(false)
                    setShowLanding(true)
                  }}
                >
                  Logout
                </button>
              </div>
            </header>
            <main className="admin-content">
              {sectionContent}
            </main>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
