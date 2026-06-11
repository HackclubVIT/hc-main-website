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
  { title: 'Campus AI Mentor', owner: 'Ananya Rao', status: 'Review', rating: '4.7', contributors: 'Nikhil, Aarav' },
  { title: 'VIT Hack Tracker', owner: 'Rishi Kumar', status: 'Published', rating: '4.9', contributors: 'Sana, Diya' },
  { title: 'Green Code Initiative', owner: 'Priya Menon', status: 'Draft', rating: '4.3', contributors: 'Pooja, Rahul' },
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
  { rank: 5, student: 'Rohan Gupta', points: 1150 },
  { rank: 6, student: 'Aditi Nair', points: 1090 },
  { rank: 7, student: 'Karan Mehra', points: 1010 },
  { rank: 8, student: 'Pooja Bhatt', points: 950 },
  { rank: 9, student: 'Rahul Das', points: 890 },
  { rank: 10, student: 'Siddharth Rao', points: 840 },
]

const profile = {
  name: 'Priya Sharma',
  role: 'Frontend Lead',
  registerNumber: '21BCE10234',
  email: 'priya@hackclubvit.in',
  phoneNumber: '+91 9876543210',
  location: 'Chennai',
  joined: 'Aug 2023',
  github: 'github.com/priyasharma',
  portfolio: 'priyasharma.dev',
}

const contributions = [
  { label: 'Projects contributed', value: '18' },
  { label: 'Ideas shared', value: '27' },
  { label: 'Mentorship hours', value: '94' },
  { label: 'Events hosted', value: '6' },
]

const recentActivities = [
  { label: 'Submitted project proposal', detail: 'CodeStorm 24H preparation', time: '2h ago' },
  { label: 'Reviewed upload', detail: 'Design resources from Aditi', time: '5h ago' },
  { label: 'Commented on team planning', detail: 'UI flow for new dashboard', time: '1d ago' },
]

const skills = ['React', 'Node.js', 'Figma', 'Python', 'Git', 'Tailwind']

const eventsList = [
  { title: 'CodeStorm kickoff', date: 'Jul 12', status: 'Confirmed' },
  { title: 'Portfolio review', date: 'Jul 18', status: 'Planning' },
  { title: 'Mentor roundtable', date: 'Jul 22', status: 'Open' },
]

const teamUpdates = [
  { title: 'Mentorship squad formed', detail: 'New pod for freshers onboarding' },
  { title: 'Site refresh completed', detail: 'Event landing page now live' },
]

const progressTracking = [
  { project: 'HackDay portal', progress: 82 },
  { project: 'Campus AI Mentor', progress: 67 },
  { project: 'Community wiki', progress: 93 },
]

const githubLinks = [
  { label: 'GitHub', url: 'https://github.com/priyasharma' },
  { label: 'Portfolio', url: 'https://priyasharma.dev' },
]

const analytics = [
  { label: 'Active sessions', value: '1.2K' },
  { label: 'Project uploads', value: '42' },
  { label: 'Review throughput', value: '88%' },
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
  const [splashText, setSplashText] = useState('')
  const [activeSection, setActiveSection] = useState('Overview')
  const [loginMode, setLoginMode] = useState('user')
  const [sessionType, setSessionType] = useState(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordTimer, setForgotPasswordTimer] = useState(0)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)

  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showBugReport, setShowBugReport] = useState(false)
  const [bugReport, setBugReport] = useState({ title: '', description: '' })
  
  const [showAddProject, setShowAddProject] = useState(false)
  const [newProject, setNewProject] = useState({ title: '', description: '', github: '', deployment: '', status: 'Pending', owner: 'Priya Sharma', rating: '0.0' })

  const [dashboardProfile, setDashboardProfile] = useState(profile)
  const [dashboardContributions, setDashboardContributions] = useState(contributions)
  const [dashboardProjects, setDashboardProjects] = useState(projects)
  const [dashboardActivities, setDashboardActivities] = useState(recentActivities)
  const [dashboardEvents, setDashboardEvents] = useState(eventsList)
  const [dashboardTeamUpdates, setDashboardTeamUpdates] = useState(teamUpdates)
  const [dashboardProgress, setDashboardProgress] = useState(progressTracking)
  const [dashboardLinks, setDashboardLinks] = useState(githubLinks)
  const [dashboardAnalytics, setDashboardAnalytics] = useState(analytics)
  const [dashboardSkills, setDashboardSkills] = useState(skills)
  const [dashboardAnnouncements, setDashboardAnnouncements] = useState(announcements)

  const [dashboardPassword, setDashboardPassword] = useState({ current: '', new: '', confirm: '' })

  const [userSection, setUserSection] = useState('overview')
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactData, setContactData] = useState({ email: '', subject: '', message: '' })

  const [adminUsers, setAdminUsers] = useState(users)
  const [adminProjects, setAdminProjects] = useState(projects)
  const [adminUploads, setAdminUploads] = useState(uploads)
  const [adminAnnouncements, setAdminAnnouncements] = useState(announcements)
  const [adminSystemStatus, setAdminSystemStatus] = useState(systemStatus)

  const [isAdminSidebarMinimized, setIsAdminSidebarMinimized] = useState(false)
  const [showAdminProfileDropdown, setShowAdminProfileDropdown] = useState(false)
  const [showSystemNotes, setShowSystemNotes] = useState(false)

  useEffect(() => {
    if (!authenticated || !showSplash) return undefined

    const textTimer = window.setTimeout(() => {
      setShowSplashPhase(1)
    }, 800)

    const text = 'HackClub';
    const intervals = [];
    for (let i = 1; i <= text.length; i++) {
        const timer = setTimeout(() => {
            setSplashText(text.substring(0, i));
        }, 800 + (i * 120));
        intervals.push(timer);
    }

    const hideTimer = window.setTimeout(() => {
      setShowSplash(false)
      setShowSplashPhase(0)
      setSplashText('')
    }, 800 + (text.length * 120) + 600)

    return () => {
      window.clearTimeout(textTimer)
      window.clearTimeout(hideTimer)
      intervals.forEach(clearTimeout)
    }
  }, [authenticated, showSplash])

  useEffect(() => {
    let interval;
    if (forgotPasswordTimer > 0) {
      interval = setInterval(() => {
        setForgotPasswordTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [forgotPasswordTimer])

  const sectionContent = useMemo(() => {
    switch (activeSection) {
      case 'Dashboard':
        return (
          <>
            <section className="panel-section">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Dashboard</p>
                </div>
                <button
                  className="button button-primary"
                  type="button"
                  onClick={() => window.alert('Changes are stored locally for this session.')}
                >
                  Save changes
                </button>
              </div>
              <div className="dashboard-grid">
                <div className="panel-card" style={{ gridColumn: '1 / -1' }}>
                  <p className="eyebrow">Contribution Overview</p>
                  <div className="mini-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {dashboardContributions.map((item, index) => (
                      <div key={item.label} className="summary-pill">
                        <span>{item.label}</span>
                        <input
                          value={item.value}
                          onChange={(event) => setDashboardContributions((prev) => prev.map((current, idx) => idx === index ? { ...current, value: event.target.value } : current))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
            <section className="panel-section cards-grid" style={{ marginTop: '24px' }}>
                <div className="panel-card">
                  <p className="eyebrow">Uploaded Projects</p>
                  <div className="list-card">
                    {dashboardProjects.slice(0, 3).map((project, index) => (
                      <div key={project.title} className="list-item">
                        <div>
                          <strong>{project.title}</strong>
                          <p>{project.owner} · {project.status}</p>
                        </div>
                        <div>
                          <input
                            value={project.status}
                            onChange={(event) => setDashboardProjects((prev) => prev.map((current, idx) => idx === index ? { ...current, status: event.target.value } : current))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="panel-card">
                  <p className="eyebrow">Recent Activities</p>
                  <div className="activity-list">
                    {dashboardActivities.slice(0, 3).map((item, index) => (
                      <div key={item.label} className="activity-item">
                        <div>
                          <strong>{item.label}</strong>
                          <input
                            value={item.detail}
                            onChange={(event) => setDashboardActivities((prev) => prev.map((current, idx) => idx === index ? { ...current, detail: event.target.value } : current))}
                          />
                        </div>
                        <span>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
          </>
        )
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
              <div className="table-row table-head" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 100px' }}>
                <div>Name</div>
                <div>Role</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              {adminUsers.map((user, index) => (
                <div key={user.name} className="table-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 100px', alignItems: 'center' }}>
                  <div>{user.name}</div>
                  <div>{user.role}</div>
                  <div><span className={`status-pill status-${user.status.toLowerCase()}`}>{user.status}</span></div>
                  <div>
                    <button className="button button-outlined" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff5555', borderColor: '#ff5555' }} onClick={() => setAdminUsers(adminUsers.filter((_, i) => i !== index))}>Remove</button>
                  </div>
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
              <div className="table-row table-head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 150px' }}>
                <div>Project</div>
                <div>Owner</div>
                <div>Status</div>
                <div>Rating</div>
                <div>Actions</div>
              </div>
              {adminProjects.map((project, index) => (
                <div key={project.title} className="table-row" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 150px', alignItems: 'center' }}>
                  <div>{project.title}</div>
                  <div>{project.owner}</div>
                  <div><span className={`status-pill status-${project.status.toLowerCase()}`}>{project.status}</span></div>
                  <div>{project.rating}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="button button-outlined" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setAdminProjects((prev) => prev.map((current, idx) => idx === index ? { ...current, status: project.status === 'Approved' ? 'Pending' : 'Approved' } : current))}>{project.status === 'Approved' ? 'Unpublish' : 'Publish'}</button>
                    <button className="button button-outlined" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ff5555', borderColor: '#ff5555' }} onClick={() => setAdminProjects(adminProjects.filter((_, i) => i !== index))}>Delete</button>
                  </div>
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
              {adminUploads.map((item, index) => (
                <div key={item.content} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong>{item.content}</strong>
                      {item.status && <span className={`status-pill status-${item.status.toLowerCase()}`}>{item.status}</span>}
                    </div>
                    <p style={{ marginTop: '4px' }}>{item.author} · {item.date}</p>
                  </div>
                  <div className="list-actions">
                    <button
                      className="button button-outlined"
                      type="button"
                      style={{ padding: '8px 16px', color: '#ff5555', borderColor: '#ff5555' }}
                      onClick={() => setAdminUploads((prev) => prev.map((current, idx) => idx === index ? { ...current, status: 'Rejected' } : current))}
                    >
                      Reject
                    </button>
                    <button
                      className="button button-primary"
                      type="button"
                      style={{ padding: '8px 16px' }}
                      onClick={() => setAdminUploads((prev) => prev.map((current, idx) => idx === index ? { ...current, status: 'Approved' } : current))}
                    >
                      Approve
                    </button>
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
              {adminAnnouncements.map((note) => (
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
              {adminSystemStatus.map((item) => (
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
                <p className="eyebrow">User Dashboard Overview</p>
                <h2>Welcome to your HackClub Portal</h2>
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
  }, [
    activeSection,
    dashboardProfile,
    dashboardContributions,
    dashboardProjects,
    dashboardActivities,
    dashboardAnnouncements,
    dashboardEvents,
    dashboardTeamUpdates,
    dashboardProgress,
    dashboardLinks,
    dashboardAnalytics,
    dashboardSkills,
    adminUsers,
    adminProjects,
    adminUploads,
    adminAnnouncements,
    adminSystemStatus,
  ])

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
            
            {showForgotPassword ? (
              <>
                <p>Forgot your password? Enter your email to reset it.</p>
                <form onSubmit={(event) => {
                  event.preventDefault();
                  if (forgotPasswordEmail) {
                    window.alert("If you have written the email correctly, you will receive the email");
                    setForgotPasswordSent(true);
                    setForgotPasswordTimer(90);
                  }
                }}>
                  <label>
                    Email address
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(event) => setForgotPasswordEmail(event.target.value)}
                      placeholder="Enter your email"
                    />
                  </label>
                  <button className="button button-primary" type="submit" disabled={forgotPasswordSent && forgotPasswordTimer > 0} onClick={() => {
                    if (forgotPasswordSent && forgotPasswordTimer === 0) {
                        window.alert("Resent email. Kindly check your spam folder as well");
                        setForgotPasswordTimer(90);
                    }
                  }}>
                    {forgotPasswordSent ? (forgotPasswordTimer > 0 ? `Resend Email (${forgotPasswordTimer}s)` : 'Resend Email') : 'Submit'}
                  </button>
                  <button
                    className="button button-secondary"
                    type="button"
                    style={{ marginTop: '12px' }}
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to login
                  </button>
                </form>
              </>
            ) : (
              <>
                <p style={{ textAlign: 'center' }}>{loginMode === 'admin' ? 'Admin portal' : 'User portal'}</p>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  if (credentials.email && credentials.password) {
                    setAuthenticated(true)
                    setSessionType(loginMode)
                    setShowSplash(true)
                    setActiveSection(loginMode === 'admin' ? 'Overview' : 'Dashboard')
                    setShowLanding(false)
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
                  <div style={{ textAlign: 'right', marginBottom: '16px' }}>
                    <a href="#" style={{ color: 'var(--highlight)', fontSize: '0.85rem', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>Forgot Password?</a>
                  </div>
                  <button className="button button-primary" type="submit">Sign In</button>
                  <button
                    className="button button-secondary"
                    type="button"
                    style={{ marginTop: '12px' }}
                    onClick={() => setLoginMode(loginMode === 'user' ? 'admin' : 'user')}
                  >
                    {loginMode === 'user' ? 'Login as admin' : 'Login as user'}
                  </button>
                  <button
                    className="button button-outlined"
                    type="button"
                    style={{ marginTop: '12px' }}
                    onClick={() => setShowLanding(true)}
                  >
                    Back to Landing Page
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : showSplash ? (
        <div className="launch-screen">
          <div className="launch-card launch-inline">
            {showSplashPhase === 0 ? (
              <div className="launch-logo">
                <span className="launch-main">h</span>
                <span className="launch-dot">.</span>
              </div>
            ) : (
              <div className="launch-typing-word" style={{ fontSize: 'clamp(6rem, 10vw, 10rem)', fontWeight: '900', letterSpacing: '-0.05em', color: 'transparent', background: 'linear-gradient(135deg, #ff5a4f, #d3070e, #f25b24)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                {splashText}
              </div>
            )}
          </div>
        </div>
      ) : sessionType === 'user' ? (
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
                  onClick={() => setUserSection('projects')}
                  title="My Projects"
                >
                  <span>📁</span>
                  <span>My Projects</span>
                </button>
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
                  title="Team & Clubs"
                >
                  <span>🤝</span>
                  <span>Team & Clubs</span>
                </button>
                <button
                  className={`nav-link ${userSection === 'updates' ? 'active' : ''}`}
                  onClick={() => setUserSection('updates')}
                  title="Updates"
                >
                  <span>📣</span>
                  <span>Updates</span>
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
            <div className="user-sidebar-footer">
              {/* Footer removed as requested */}
            </div>
          </aside>
          <div className="user-layout">
            <header className="admin-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div>
                  <p className="eyebrow">User Dashboard</p>
                  <h1>Welcome back, {dashboardProfile.name}</h1>
                </div>
              </div>
              <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="button button-secondary" type="button" onClick={() => setUserSection('overview')} style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏠</span> Home
                </button>
                <div 
                  className="profile-dropdown-trigger" 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="avatar" style={{ width: '32px', height: '32px' }}>
                    {dashboardProfile.avatar && dashboardProfile.avatar.startsWith('emoji:') ? (
                      <span className="avatar-emoji" style={{ fontSize: '18px' }}>{dashboardProfile.avatar.replace('emoji:', '')}</span>
                    ) : dashboardProfile.avatar ? (
                      <img src={dashboardProfile.avatar} alt="avatar" />
                    ) : (
                      <span className="avatar-initial" style={{ fontSize: '16px' }}>{dashboardProfile.name ? dashboardProfile.name.charAt(0) : 'U'}</span>
                    )}
                  </div>
                  <span style={{ fontWeight: '500' }}>{dashboardProfile.name}</span>
                  <span style={{ fontSize: '12px' }}>▼</span>
                </div>
                {showProfileDropdown && (
                  <div className="profile-dropdown-menu" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', background: 'rgba(18, 2, 2, 0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 9999, minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => { setUserSection('profile'); setShowProfileDropdown(false); }}>Edit Profile</button>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => { setShowBugReport(true); setShowProfileDropdown(false); }}>Report a Bug</button>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start', color: '#ff5555' }} onClick={() => { setAuthenticated(false); setShowLanding(true); setSessionType(null); setShowProfileDropdown(false); }}>Logout</button>
                  </div>
                )}
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
              ) : userSection === 'overview' ? (
                sectionContent
              ) : userSection === 'profile' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">My Profile</p>
                      <h2>Manage your profile and settings</h2>
                    </div>
                  </div>
                  <div className="dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
                    <div className="panel-card profile-card">
                      <p className="eyebrow">User Profile</p>
                      <div className="profile-top">
                        <div className="avatar-wrap">
                          <div className="avatar">
                            {dashboardProfile.avatar && dashboardProfile.avatar.startsWith('emoji:') ? (
                              <span className="avatar-emoji">{dashboardProfile.avatar.replace('emoji:', '')}</span>
                            ) : dashboardProfile.avatar ? (
                              <img src={dashboardProfile.avatar} alt="avatar" />
                            ) : (
                              <span className="avatar-initial">{dashboardProfile.name ? dashboardProfile.name.charAt(0) : 'U'}</span>
                            )}
                          </div>
                          <label className="avatar-upload">
                            <input
                              type="file"
                              accept="image/*"
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
                            Change photo
                          </label>
                          <div className="avatar-picker">
                            <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:👩‍💻' }))} className="avatar-option">👩‍💻</button>
                            <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:🚀' }))} className="avatar-option">🚀</button>
                            <button type="button" onClick={() => setDashboardProfile((p) => ({ ...p, avatar: 'emoji:✨' }))} className="avatar-option">✨</button>
                          </div>
                        </div>
                        <div className="profile-meta">
                          <h3>{dashboardProfile.name}</h3>
                          <p>{dashboardProfile.role}</p>
                          <div className="info-list">
                            <div>
                              <strong>Name</strong>
                              <input
                                value={dashboardProfile.name}
                                readOnly
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                              />
                            </div>
                            <div>
                              <strong>Register Number</strong>
                              <input
                                value={dashboardProfile.registerNumber}
                                readOnly
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                              />
                            </div>
                            <div>
                              <strong>Email ID</strong>
                              <input
                                type="email"
                                value={dashboardProfile.email}
                                readOnly
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                              />
                            </div>
                            <div>
                              <strong>Phone Number</strong>
                              <input
                                type="tel"
                                value={dashboardProfile.phoneNumber}
                                onChange={(event) => setDashboardProfile((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="panel-card password-card">
                      <p className="eyebrow">Security</p>
                      <h3>Change password</h3>
                      <div className="password-form">
                        <label>
                          Current password
                          <input type="password" value={dashboardPassword.current} onChange={(e) => setDashboardPassword((p) => ({ ...p, current: e.target.value }))} />
                        </label>
                        <label>
                          New password
                          <input type="password" value={dashboardPassword.new} onChange={(e) => setDashboardPassword((p) => ({ ...p, new: e.target.value }))} />
                        </label>
                        <label>
                          Confirm new
                          <input type="password" value={dashboardPassword.confirm} onChange={(e) => setDashboardPassword((p) => ({ ...p, confirm: e.target.value }))} />
                        </label>
                        <div style={{ marginTop: 12 }}>
                          <button
                            className="button button-primary"
                            type="button"
                            onClick={() => {
                              if (!dashboardPassword.new) return window.alert('Enter a new password')
                              if (dashboardPassword.new !== dashboardPassword.confirm) return window.alert('Passwords do not match')
                              window.alert('Password changed locally for this session')
                              setDashboardPassword({ current: '', new: '', confirm: '' })
                            }}
                          >
                            Update password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              ) : userSection === 'projects' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">My Projects</p>
                      <h2>Your uploaded projects and submissions</h2>
                    </div>
                    <button className="button button-primary" type="button" onClick={() => setShowAddProject(!showAddProject)}>
                      {showAddProject ? 'Cancel' : 'Add Project'}
                    </button>
                  </div>
                  {showAddProject && (
                    <div className="panel-card" style={{ marginBottom: '24px' }}>
                      <h3>Submit a new project</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        setDashboardProjects(prev => [newProject, ...prev]);
                        setNewProject({ title: '', description: '', github: '', deployment: '', status: 'Pending', owner: 'Priya Sharma', rating: '0.0' });
                        setShowAddProject(false);
                      }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                        <label style={{ gridColumn: '1 / -1' }}>
                          Title
                          <input type="text" value={newProject.title} onChange={e => setNewProject(p => ({...p, title: e.target.value}))} required style={{ marginTop: '8px' }}/>
                        </label>
                        <label style={{ gridColumn: '1 / -1' }}>
                          Description
                          <textarea 
                            value={newProject.description} 
                            onChange={e => setNewProject(p => ({...p, description: e.target.value}))} 
                            rows="3" 
                            required 
                            style={{
                              width: '100%', padding: '12px', borderRadius: '8px', marginTop: '8px',
                              border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', 
                              color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical'
                            }}
                          />
                        </label>
                        <label>
                          GitHub Link
                          <input type="url" value={newProject.github} onChange={e => setNewProject(p => ({...p, github: e.target.value}))} required style={{ marginTop: '8px' }}/>
                        </label>
                        <label>
                          Deployment Link
                          <input type="url" value={newProject.deployment} onChange={e => setNewProject(p => ({...p, deployment: e.target.value}))} required style={{ marginTop: '8px' }}/>
                        </label>
                        <button className="button button-primary" type="submit" style={{ gridColumn: '1 / -1', justifySelf: 'start', marginTop: '8px' }}>
                          Submit Project
                        </button>
                      </form>
                    </div>
                  )}
                  <div className="list-card">
                    {dashboardProjects.map((project, index) => (
                      <div key={project.title} className="list-item" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong>{project.title}</strong>
                            <p>{project.owner} · {project.status}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                              value={project.status}
                              onChange={(event) => setDashboardProjects((prev) => prev.map((current, idx) => idx === index ? { ...current, status: event.target.value } : current))}
                              style={{ width: '100px' }}
                            />
                            <input
                              value={project.rating}
                              onChange={(event) => setDashboardProjects((prev) => prev.map((current, idx) => idx === index ? { ...current, rating: event.target.value } : current))}
                              style={{ width: '60px' }}
                            />
                            <span>{project.rating} ★</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Contributors: {project.contributors || 'None'}</span>
                          <button 
                            className="button button-outlined" 
                            style={{ color: '#ff5555', borderColor: 'rgba(255,85,85,0.3)', padding: '4px 12px', fontSize: '12px' }}
                            onClick={() => setDashboardProjects(prev => prev.filter((_, idx) => idx !== index))}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : userSection === 'activity' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">Activity</p>
                      <h2>Your recent activities and contributions</h2>
                    </div>
                  </div>
                  <div className="activity-list">
                    {dashboardActivities.map((item, index) => (
                      <div key={item.label} className="activity-item">
                        <div>
                          <strong>{item.label}</strong>
                          <input
                            value={item.detail}
                            onChange={(event) => setDashboardActivities((prev) => prev.map((current, idx) => idx === index ? { ...current, detail: event.target.value } : current))}
                          />
                        </div>
                        <span>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : userSection === 'analytics' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">Analytics</p>
                      <h2>Your activity metrics and performance</h2>
                    </div>
                  </div>
                  <div className="cards-grid">
                    {dashboardAnalytics.map((item, index) => (
                      <div key={item.label} className="panel-card">
                        <p className="eyebrow">{item.label}</p>
                        <input
                          value={item.value}
                          onChange={(event) => setDashboardAnalytics((prev) => prev.map((current, idx) => idx === index ? { ...current, value: event.target.value } : current))}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : userSection === 'leaderboard' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">Leaderboard</p>
                      <h2>Top contributors in the HackClub community</h2>
                    </div>
                  </div>
                  <div className="leaderboard-card">
                    {leaderboard.slice(0, 10).map((entry) => (
                      <div key={entry.rank} className="leaderboard-item">
                        <span style={{ 
                          width: '40px', 
                          textAlign: 'center', 
                          fontSize: entry.rank <= 3 ? '24px' : '18px', 
                          fontWeight: 'bold', 
                          color: entry.rank === 1 ? '#FFD700' : entry.rank === 2 ? '#C0C0C0' : entry.rank === 3 ? '#CD7F32' : 'inherit' 
                        }}>
                          {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                        </span>
                        <div>
                          <strong>{entry.student}</strong>
                          <p>{entry.points} points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : userSection === 'team' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">Team & Clubs</p>
                      <h2>Connect with teams and club groups</h2>
                    </div>
                  </div>
                  <div className="panel-card">
                    <div className="timeline-list">
                      {dashboardTeamUpdates.map((item, index) => (
                        <div key={item.title} className="timeline-item">
                          <strong>{item.title}</strong>
                          <input
                            value={item.detail}
                            onChange={(event) => setDashboardTeamUpdates((prev) => prev.map((current, idx) => idx === index ? { ...current, detail: event.target.value } : current))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : userSection === 'updates' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">Updates</p>
                      <h2>Latest news from HackClub VIT Chennai</h2>
                    </div>
                  </div>
                  <div className="announcement-grid">
                    {dashboardAnnouncements.map((note) => (
                      <div key={note.title} className="panel-card announcement-card">
                        <div className="pill">{note.label}</div>
                        <h3>{note.title}</h3>
                        <p>{note.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : userSection === 'notifications' ? (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">Notifications</p>
                      <h2>Your personal notifications</h2>
                    </div>
                  </div>
                  <div className="list-card">
                    {dashboardAnnouncements.map((note, index) => (
                      <div key={note.title} className="list-item">
                        <div>
                          <strong>{note.title}</strong>
                          <input
                            value={note.body}
                            onChange={(event) => setDashboardAnnouncements((prev) => prev.map((current, idx) => idx === index ? { ...current, body: event.target.value } : current))}
                          />
                        </div>
                        <span className="pill">{note.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <section className="panel-section">
                  <div className="section-head">
                    <div>
                      <p className="eyebrow">Events</p>
                      <h2>Upcoming HackClub events and deadlines</h2>
                    </div>
                  </div>
                  <div className="panel-card">
                    <div className="timeline-list">
                      {dashboardEvents.map((event, index) => (
                        <div key={event.title} className="timeline-item">
                          <strong>{event.title}</strong>
                          <input
                            value={event.status}
                            onChange={(eventUpdate) => setDashboardEvents((prev) => prev.map((current, idx) => idx === index ? { ...current, status: eventUpdate.target.value } : current))}
                          />
                          <p>{event.date} · {event.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </main>
            <footer className="app-footer" style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
              <button className="button button-outlined" type="button" onClick={() => setShowBugReport(true)}>Report a Bug</button>
            </footer>
          </div>
        </div>
      ) : (
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
                  onClick={() => setActiveSection(item)}
                  title={item}
                >
                  {isAdminSidebarMinimized ? item.charAt(0) : item}
                </button>
              ))}
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
              <div>
                <p className="eyebrow">Admin Portal</p>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{activeSection}</h1>
              </div>
              <div className="header-actions" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div className="search-box">
                  <span>🔍</span>
                  <input type="text" placeholder="Search admin tools..." />
                </div>
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
                  <div className="profile-dropdown-menu" style={{ position: 'absolute', top: '100%', right: '0', marginTop: '8px', background: 'rgba(18, 2, 2, 0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 9999, minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => setShowAdminProfileDropdown(false)}>Reports</button>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start' }} onClick={() => { setShowSystemNotes(true); setShowAdminProfileDropdown(false); }}>System Notes</button>
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                    <button className="button button-outlined" style={{ border: 'none', justifyContent: 'flex-start', color: '#ff5555' }} onClick={() => { setAuthenticated(false); setShowLanding(true); setSessionType(null); setShowAdminProfileDropdown(false); }}>Logout</button>
                  </div>
                )}
              </div>
            </header>
            <main className="admin-content">
              {sectionContent}
            </main>
            <footer className="app-footer" style={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
              <button className="button button-outlined" type="button" onClick={() => setShowSystemNotes(true)}>System notes</button>
            </footer>
          </div>
        </div>
      )}

      {showSystemNotes && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h2>System Notes</h2>
              <button className="close-btn" onClick={() => setShowSystemNotes(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Note Title</label>
                <input type="text" placeholder="E.g., Server restart" />
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea rows="4" placeholder="Enter system log or maintenance note..."></textarea>
              </div>
              <button className="button button-primary" style={{ width: '100%', marginTop: '16px' }} onClick={() => {
                window.alert('System note saved locally.');
                setShowSystemNotes(false);
              }}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
