import { useState, useEffect } from 'react'
import { navItems } from './data/mockData'
import './App.css'
import HackClubLanding from './LandingPage.jsx'
import LoginShell from './components/LoginShell'
import LaunchScreen from './components/LaunchScreen'
import UserPortal from './components/UserPortal'
import AdminPortal from './components/AdminPortal'
import RecruitmentPortal from './components/RecruitmentPortal'
import { api, getToken, clearToken } from './api'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [showSplash, setShowSplash] = useState(false)
  const [sessionType, setSessionType] = useState(null)
  
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Global Sync States
  const [globalAnnouncements, setGlobalAnnouncements] = useState([])
  const [globalUsers, setGlobalUsers] = useState([])
  const [globalProjects, setGlobalProjects] = useState([])
  const [globalUploads, setGlobalUploads] = useState([])
  const [globalActivities, setGlobalActivities] = useState([])
  const [globalEvents, setGlobalEvents] = useState([])
  const [globalTeamUpdates, setGlobalTeamUpdates] = useState([])
  const [globalFeedbacks, setGlobalFeedbacks] = useState([])
  const [globalSystemStatus, setGlobalSystemStatus] = useState([])
  const [globalAnalytics, setGlobalAnalytics] = useState({
    activeSessions: '1.2K',
    projectUploads: '42',
    reviewThroughput: '88%'
  })
  const [globalWeeklyWinners, setGlobalWeeklyWinners] = useState({})
  const [globalMonthlyWinners, setGlobalMonthlyWinners] = useState({})
  const [globalProfile, setGlobalProfile] = useState({})
  const [globalContributions, setGlobalContributions] = useState([])
  const [globalRecruitmentApplications, setGlobalRecruitmentApplications] = useState([])
  const [globalAllowlist, setGlobalAllowlist] = useState([])
  
  const [readAnnouncementsCount, setReadAnnouncementsCount] = useState(0)
  const [showRecruitment, setShowRecruitment] = useState(false)

  // Fetch all global data from the backend
  const fetchGlobalData = async () => {
    try {
      const data = await api.getData()
      setGlobalAnnouncements(data.announcements || [])
      setGlobalUsers(data.users || [])
      setGlobalProjects(data.projects || [])
      setGlobalUploads(data.uploads || [])
      setGlobalActivities(data.recentActivities || [])
      setGlobalEvents(data.eventsList || [])
      setGlobalTeamUpdates(data.teamUpdates || [])
      setGlobalFeedbacks(data.feedbacks || [])
      setGlobalSystemStatus(data.systemStatus || [])
      setGlobalWeeklyWinners(data.weeklyWinners || {})
      setGlobalMonthlyWinners(data.monthlyWinners || {})
      setGlobalProfile(data.profile || {})
      setGlobalContributions(data.contributions || [])
      setGlobalRecruitmentApplications(data.recruitmentApplications || [])
      setGlobalAllowlist(data.allowedEmails || [])
      setReadAnnouncementsCount(data.announcements?.length || 0)
    } catch (err) {
      console.error('Error fetching global database state:', err)
    }
  }

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = getToken()
    if (token) {
      api.getMe()
        .then((data) => {
          setAuthenticated(true)
          setSessionType(data.user.role)
          setShowLanding(false)
          return fetchGlobalData()
        })
        .then(() => {
          setIsCheckingSession(false)
        })
        .catch((err) => {
          console.error('Session expired or invalid token:', err)
          clearToken()
          setAuthenticated(false)
          setSessionType(null)
          setIsCheckingSession(false)
        })
    } else {
      setIsCheckingSession(false)
    }
  }, [])

  // Sync setters wrappers to send updates back to Express API
  const handleSetGlobalAnnouncements = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalAnnouncements) : updater
    setGlobalAnnouncements(next)
    try {
      await fetch('/api/announcements', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving announcements:', e)
    }
  }

  const handleSetGlobalUsers = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalUsers) : updater
    setGlobalUsers(next)
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving users:', e)
    }
  }

  const handleSetGlobalProjects = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalProjects) : updater
    setGlobalProjects(next)
    try {
      await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving projects:', e)
    }
  }

  const handleSetGlobalUploads = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalUploads) : updater
    setGlobalUploads(next)
    try {
      await fetch('/api/uploads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving uploads:', e)
    }
  }

  const handleSetGlobalActivities = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalActivities) : updater
    setGlobalActivities(next)
    try {
      await fetch('/api/activities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving activities:', e)
    }
  }

  const handleSetGlobalEvents = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalEvents) : updater
    setGlobalEvents(next)
    try {
      await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving events:', e)
    }
  }

  const handleSetGlobalTeamUpdates = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalTeamUpdates) : updater
    setGlobalTeamUpdates(next)
    try {
      await fetch('/api/team-updates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving team updates:', e)
    }
  }

  const handleSetGlobalFeedbacks = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalFeedbacks) : updater
    setGlobalFeedbacks(next)
    try {
      await fetch('/api/feedbacks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving feedbacks:', e)
    }
  }

  const handleSetGlobalProfile = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalProfile) : updater
    setGlobalProfile(next)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving profile:', e)
    }
  }

  const handleSetGlobalContributions = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalContributions) : updater
    setGlobalContributions(next)
    try {
      await fetch('/api/contributions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving contributions:', e)
    }
  }

  const handleSetGlobalSystemStatus = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalSystemStatus) : updater
    setGlobalSystemStatus(next)
    try {
      await fetch('/api/system-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving system status:', e)
    }
  }

  const handleSetGlobalWeeklyWinners = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalWeeklyWinners) : updater
    setGlobalWeeklyWinners(next)
    try {
      await fetch('/api/weekly-winners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving weekly winners:', e)
    }
  }

  const handleSetGlobalMonthlyWinners = async (updater) => {
    const next = typeof updater === 'function' ? updater(globalMonthlyWinners) : updater
    setGlobalMonthlyWinners(next)
    try {
      await fetch('/api/monthly-winners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify(next)
      })
    } catch (e) {
      console.error('Error saving monthly winners:', e)
    }
  }

  const handleLogin = (mode) => {
    setAuthenticated(true)
    setSessionType(mode)
    setShowSplash(true)
    setShowLanding(false)
    fetchGlobalData()
  }

  const handleLogout = () => {
    clearToken()
    setAuthenticated(false)
    setSessionType(null)
    setShowLanding(true)
    
    // Clear local states
    setGlobalAnnouncements([])
    setGlobalUsers([])
    setGlobalProjects([])
    setGlobalUploads([])
    setGlobalActivities([])
    setGlobalEvents([])
    setGlobalTeamUpdates([])
    setGlobalFeedbacks([])
    setGlobalSystemStatus([])
  }

  if (isCheckingSession) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#020000', color: '#f4ede4', fontFamily: 'monospace' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#ac120c', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ letterSpacing: '0.12em', fontSize: '14px', textTransform: 'uppercase' }}>Securing Connection...</div>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return <HackClubLanding onLogin={() => setShowLanding(false)} onOpenRecruitment={() => { setShowLanding(false); setShowRecruitment(true); }} />
  }

  if (showRecruitment) {
    return <RecruitmentPortal onBack={() => { setShowRecruitment(false); setShowLanding(true); }} />
  }

  return (
    <div className="app-shell">
      {!authenticated ? (
        <LoginShell onLogin={handleLogin} onBackToLanding={() => setShowLanding(true)} />
      ) : showSplash ? (
        <LaunchScreen onComplete={() => setShowSplash(false)} />
      ) : sessionType === 'user' ? (
        <UserPortal 
          onLogout={handleLogout} 
          globalAnnouncements={globalAnnouncements} 
          readAnnouncementsCount={readAnnouncementsCount}
          setReadAnnouncementsCount={setReadAnnouncementsCount}
          globalUsers={globalUsers}
          globalProjects={globalProjects}
          setGlobalProjects={handleSetGlobalProjects}
          globalUploads={globalUploads}
          setGlobalUploads={handleSetGlobalUploads}
          globalActivities={globalActivities}
          setGlobalActivities={handleSetGlobalActivities}
          globalEvents={globalEvents}
          setGlobalEvents={handleSetGlobalEvents}
          globalTeamUpdates={globalTeamUpdates}
          setGlobalTeamUpdates={handleSetGlobalTeamUpdates}
          globalFeedbacks={globalFeedbacks}
          setGlobalFeedbacks={handleSetGlobalFeedbacks}
          globalAnalytics={globalAnalytics}
          globalWeeklyWinners={globalWeeklyWinners}
          globalMonthlyWinners={globalMonthlyWinners}
          globalProfile={globalProfile}
          setGlobalProfile={handleSetGlobalProfile}
          globalContributions={globalContributions}
          setGlobalContributions={handleSetGlobalContributions}
        />
      ) : (
        <AdminPortal 
          onLogout={handleLogout} 
          globalAnnouncements={globalAnnouncements} 
          setGlobalAnnouncements={handleSetGlobalAnnouncements} 
          readAnnouncementsCount={readAnnouncementsCount}
          setReadAnnouncementsCount={setReadAnnouncementsCount}
          globalUsers={globalUsers}
          setGlobalUsers={handleSetGlobalUsers}
          globalProjects={globalProjects}
          setGlobalProjects={handleSetGlobalProjects}
          globalUploads={globalUploads}
          setGlobalUploads={handleSetGlobalUploads}
          globalSystemStatus={globalSystemStatus}
          setGlobalSystemStatus={handleSetGlobalSystemStatus}
          globalFeedbacks={globalFeedbacks}
          globalAnalytics={globalAnalytics}
          globalWeeklyWinners={globalWeeklyWinners}
          setGlobalWeeklyWinners={handleSetGlobalWeeklyWinners}
          globalMonthlyWinners={globalMonthlyWinners}
          setGlobalMonthlyWinners={handleSetGlobalMonthlyWinners}
          globalRecruitmentApplications={globalRecruitmentApplications}
          setGlobalRecruitmentApplications={setGlobalRecruitmentApplications}
          globalAllowlist={globalAllowlist}
          setGlobalAllowlist={setGlobalAllowlist}
        />
      )}
    </div>
  )
}

export default App
