import { useState } from 'react'
import { 
  announcements as initialAnnouncements, 
  users as initialUsers,
  projects as initialProjects,
  uploads as initialUploads,
  recentActivities as initialActivities,
  eventsList as initialEvents,
  teamUpdates as initialTeamUpdates,
  feedbacks as initialFeedbacks,
  systemStatus as initialSystemStatus,
  analytics as initialAnalytics,
  weeklyWinners as initialWeeklyWinners,
  monthlyWinners as initialMonthlyWinners,
  profile as initialProfile,
  contributions as initialContributions
} from './data/mockData'
import './App.css'
import HackClubLanding from './LandingPage.jsx'
import LoginShell from './components/LoginShell'
import LaunchScreen from './components/LaunchScreen'
import UserPortal from './components/UserPortal'
import AdminPortal from './components/AdminPortal'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [showSplash, setShowSplash] = useState(false)
  const [sessionType, setSessionType] = useState(null)
  
  const [globalAnnouncements, setGlobalAnnouncements] = useState(initialAnnouncements)
  const [globalUsers, setGlobalUsers] = useState(initialUsers)
  const [globalProjects, setGlobalProjects] = useState(initialProjects)
  const [globalUploads, setGlobalUploads] = useState(initialUploads)
  const [globalActivities, setGlobalActivities] = useState(initialActivities)
  const [globalEvents, setGlobalEvents] = useState(initialEvents)
  const [globalTeamUpdates, setGlobalTeamUpdates] = useState(initialTeamUpdates)
  const [globalFeedbacks, setGlobalFeedbacks] = useState(initialFeedbacks)
  const [globalSystemStatus, setGlobalSystemStatus] = useState(initialSystemStatus)
  const [globalAnalytics] = useState(initialAnalytics)
  const [globalWeeklyWinners, setGlobalWeeklyWinners] = useState(initialWeeklyWinners)
  const [globalMonthlyWinners, setGlobalMonthlyWinners] = useState(initialMonthlyWinners)
  const [globalProfile, setGlobalProfile] = useState(initialProfile)
  const [globalContributions, setGlobalContributions] = useState(initialContributions)
  
  const [readAnnouncementsCount, setReadAnnouncementsCount] = useState(initialAnnouncements.length)

  const handleLogin = (mode) => {
    setAuthenticated(true)
    setSessionType(mode)
    setShowSplash(true)
    setShowLanding(false)
  }

  const handleLogout = () => {
    setAuthenticated(false)
    setSessionType(null)
    setShowLanding(true)
  }

  if (showLanding) {
    return <HackClubLanding onLogin={() => setShowLanding(false)} />
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
          setGlobalProjects={setGlobalProjects}
          globalUploads={globalUploads}
          setGlobalUploads={setGlobalUploads}
          globalActivities={globalActivities}
          setGlobalActivities={setGlobalActivities}
          globalEvents={globalEvents}
          setGlobalEvents={setGlobalEvents}
          globalTeamUpdates={globalTeamUpdates}
          setGlobalTeamUpdates={setGlobalTeamUpdates}
          globalFeedbacks={globalFeedbacks}
          setGlobalFeedbacks={setGlobalFeedbacks}
          globalAnalytics={globalAnalytics}
          globalWeeklyWinners={globalWeeklyWinners}
          globalMonthlyWinners={globalMonthlyWinners}
          globalProfile={globalProfile}
          setGlobalProfile={setGlobalProfile}
          globalContributions={globalContributions}
          setGlobalContributions={setGlobalContributions}
        />
      ) : (
        <AdminPortal 
          onLogout={handleLogout} 
          globalAnnouncements={globalAnnouncements} 
          setGlobalAnnouncements={setGlobalAnnouncements} 
          readAnnouncementsCount={readAnnouncementsCount}
          setReadAnnouncementsCount={setReadAnnouncementsCount}
          globalUsers={globalUsers}
          setGlobalUsers={setGlobalUsers}
          globalProjects={globalProjects}
          setGlobalProjects={setGlobalProjects}
          globalUploads={globalUploads}
          setGlobalUploads={setGlobalUploads}
          globalSystemStatus={globalSystemStatus}
          setGlobalSystemStatus={setGlobalSystemStatus}
          globalFeedbacks={globalFeedbacks}
          globalAnalytics={globalAnalytics}
          globalWeeklyWinners={globalWeeklyWinners}
          setGlobalWeeklyWinners={setGlobalWeeklyWinners}
          globalMonthlyWinners={globalMonthlyWinners}
          setGlobalMonthlyWinners={setGlobalMonthlyWinners}
        />
      )}
    </div>
  )
}

export default App
