export const navItems = [
  'Dashboard',
  'Announcements',
  'Manage Users',
  'Manage Projects',
  'Ratings Management',
  'Leaderboard',
  'Leaderboard Management',
  'Recruitment',
  'Signup Allowlist',
  'Analytics',
  'Feedback',
  'System',
]

export const stats = [
  { label: 'Total Members', value: '1,254' },
  { label: 'Total Projects', value: '432' },
  { label: 'Reviewers', value: '45' },
  { label: 'Pending Uploads', value: '28' },
]

export const users = [
  { 
    id: 1, name: 'Ananya Rao', role: 'Moderator', status: 'Active', isReviewer: true,
    projectsUploaded: 5, averageRating: 4.8, badges: ['Top Performer', 'Active Contributor'],
    recentProjects: ['Campus AI Mentor', 'HackClub Website'],
    projectRatingScore: 95, contributionScore: 85, eventScore: 90
  },
  { 
    id: 2, name: 'Rishi Kumar', role: 'Project Lead', status: 'Pending', isReviewer: false,
    projectsUploaded: 2, averageRating: 4.5, badges: ['Problem Solver'],
    recentProjects: ['VIT Hack Tracker'],
    projectRatingScore: 85, contributionScore: 60, eventScore: 70
  },
  { 
    id: 3, name: 'Priya Menon', role: 'Content Admin', status: 'Active', isReviewer: true,
    projectsUploaded: 4, averageRating: 4.3, badges: ['Team Player', 'Consistent Learner'],
    recentProjects: ['Green Code Initiative'],
    projectRatingScore: 80, contributionScore: 90, eventScore: 80
  },
  { 
    id: 4, name: 'Sahil Nair', role: 'Member', status: 'Inactive', isReviewer: false,
    projectsUploaded: 0, averageRating: 0, badges: [],
    recentProjects: [],
    projectRatingScore: 0, contributionScore: 10, eventScore: 5
  },
  {
    id: 5, name: 'Srinath', role: 'Member', status: 'Active', isReviewer: false,
    projectsUploaded: 3, averageRating: 4.9, badges: ['Innovator', 'Full Stack Developer'],
    recentProjects: ['Leaderboard UI', 'Sorting Algorithm Visualizer'],
    projectRatingScore: 98, contributionScore: 88, eventScore: 85
  }
]

// Calculate total score dynamically for mock users
users.forEach(u => {
  u.totalScore = Math.round((u.projectRatingScore * 0.7) + (u.contributionScore * 0.2) + (u.eventScore * 0.1));
})

export const projects = [
  { 
    id: 101, title: 'Campus AI Mentor', owner: 'Ananya Rao', status: 'Review', rating: '4.7', contributors: 'Nikhil, Aarav',
    technologiesUsed: ['React', 'Python', 'FastAPI'], submissionDate: '2026-06-05', awards: ['Best Innovation'],
    individualRatings: [
      { user: 'Srinath', rating: 5, comment: 'Great project, very useful for students.' },
      { user: 'FakeBot123', rating: 1, comment: 'Bad' },
      { user: 'Priya Menon', rating: 4.5, comment: 'Good UI and smooth transitions.' },
      { user: 'CryptoSpammer', rating: 5, comment: 'buy crypto at totallylegit.com!!' },
      { user: 'Rahul', rating: 4.0, comment: 'Nice, but could use a few more features.' },
      { user: 'Aditi', rating: 5.0, comment: 'Loved the AI integration! Super helpful.' },
      { user: 'Hater123', rating: 1.0, comment: 'i hate ai' },
      { user: 'Nikhil', rating: 4.8, comment: 'Code is very clean and modular.' },
      { user: 'Sana', rating: 4.2, comment: 'Works well for me on mobile.' },
      { user: 'BotNet_00', rating: 1.0, comment: 'terrible terrible terrible' }
    ]
  },
  { 
    id: 102, title: 'VIT Hack Tracker', owner: 'Rishi Kumar', status: 'Published', rating: '4.9', contributors: 'Sana, Diya',
    technologiesUsed: ['Next.js', 'Tailwind', 'MongoDB'], submissionDate: '2026-06-01', awards: ['Top Project of the Week'],
    individualRatings: [
      { user: 'Ananya Rao', rating: 5, comment: 'Very useful!' },
      { user: 'Sahil Nair', rating: 4.8, comment: 'Nice work' }
    ]
  },
  { 
    id: 103, title: 'Green Code Initiative', owner: 'Priya Menon', status: 'Draft', rating: '4.3', contributors: 'Pooja, Rahul',
    technologiesUsed: ['Vue.js', 'Node.js'], submissionDate: '2026-06-10', awards: [],
    individualRatings: []
  },
]

export const badgeDefinitions = [
  { id: 'top_performer', label: 'Top Performer', icon: '🥇' },
  { id: 'innovator', label: 'Innovator', icon: '🚀' },
  { id: 'full_stack', label: 'Full Stack Developer', icon: '💻' },
  { id: 'active_contributor', label: 'Active Contributor', icon: '🔥' },
  { id: 'hackathon_winner', label: 'Hackathon Winner', icon: '🏆' },
  { id: 'problem_solver', label: 'Problem Solver', icon: '🎯' },
  { id: 'consistent_learner', label: 'Consistent Learner', icon: '📚' },
  { id: 'team_player', label: 'Team Player', icon: '🤝' }
]

export const weeklyWinners = {
  topContributor: 'Ananya Rao',
  topProject: 'VIT Hack Tracker',
  mostActive: 'Priya Menon',
  bestInnovation: 'Campus AI Mentor'
}

export const monthlyWinners = {
  hallOfFame: ['Nikhil Singh', 'Ananya Rao', 'Srinath'],
  topProject: 'AI Interview Bot'
}

export const uploads = [
  { id: 1, content: 'HackClub event poster', author: 'Aditi Sharma', date: 'Jun 09', status: 'New' },
  { id: 2, content: 'Team demo video', author: 'Hrithik Jain', date: 'Jun 08', status: 'Pending' },
  { id: 3, content: 'Project report', author: 'Meera Pillai', date: 'Jun 07', status: 'New' },
]

export const profile = {
  name: 'Priya Sharma',
  role: 'Frontend Lead',
  registerNumber: '21BCE10234',
  email: 'priya@hackclubvit.in',
  phoneNumber: '+91 9876543210',
  location: 'Chennai',
  joined: 'Aug 2023',
  github: 'github.com/priyasharma',
  portfolio: 'priyasharma.dev',
  badges: ['Top Performer', 'Active Contributor']
}

export const contributions = [
  { label: 'Projects contributed', value: '18' },
  { label: 'Ideas shared', value: '27' },
  { label: 'Mentorship hours', value: '94' },
  { label: 'Events hosted', value: '6' },
]

export const recentActivities = [
  { label: 'Submitted project proposal', detail: 'CodeStorm 24H preparation', time: '2h ago' },
  { label: 'Reviewed upload', detail: 'Design resources from Aditi', time: '5h ago' },
  { label: 'Commented on team planning', detail: 'UI flow for new dashboard', time: '1d ago' },
]

export const skills = ['React', 'Node.js', 'Figma', 'Python', 'Git', 'Tailwind']

export const eventsList = [
  { title: 'CodeStorm kickoff', date: 'Jul 12', status: 'Confirmed' },
  { title: 'Portfolio review', date: 'Jul 18', status: 'Planning' },
  { title: 'Mentor roundtable', date: 'Jul 22', status: 'Open' },
]

export const teamUpdates = [
  { title: 'Mentorship squad formed', detail: 'New pod for freshers onboarding' },
  { title: 'Site refresh completed', detail: 'Event landing page now live' },
]

export const progressTracking = [
  { project: 'HackDay portal', progress: 82 },
  { project: 'Campus AI Mentor', progress: 67 },
  { project: 'Community wiki', progress: 93 },
]

export const githubLinks = [
  { label: 'GitHub', url: 'https://github.com/priyasharma' },
  { label: 'Portfolio', url: 'https://priyasharma.dev' },
]

export const analytics = [
  { label: 'Active sessions', value: '1.2K' },
  { label: 'Project uploads', value: '42' },
  { label: 'Review throughput', value: '88%' },
]

export const feedbacks = [
  { user: 'Lakshmi', message: 'Need a faster upload flow for large files.', type: 'Suggestion' },
  { user: 'Karan', message: 'Project approval notifications are very helpful.', type: 'Praise' },
  { user: 'Megha', message: 'Analytics should include weekly trends.', type: 'Request' },
]

export const announcements = [
  { title: 'HackClub Meet', body: 'Weekly meetup scheduled for Friday at 5 PM.', label: 'Live' },
  { title: 'Project Deadline', body: 'Final project submissions close on Jun 20.', label: 'Urgent' },
]

export const systemStatus = [
  { label: 'Database', value: 'Online' },
  { label: 'API', value: 'Stable' },
  { label: 'Storage', value: '92% Capacity' },
]

export const validCredentials = { adminEmail: 'admin@vitstudent.ac.in', userEmail: 'user@vitstudent.ac.in', password: 'Hackclub@2026' };
