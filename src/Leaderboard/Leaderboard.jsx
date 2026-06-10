import { useState } from 'react'
import './Leaderboard.css'

const members = [
  {
    id: 1,
    name: 'Aarav Sharma',
    role: 'Frontend Lead',
    projects: 5,
    weeklyPoints: 148,
    monthlyPoints: 450,
    contributionScore: 92,
    activityScore: 88,
    badges: ['🥇 Top Contributor', '🚀 Code Ninja'],
    status: 'Active',
    trend: '+14%',
  },
  {
    id: 2,
    name: 'Ananya Iyer',
    role: 'Product Builder',
    projects: 4,
    weeklyPoints: 156,
    monthlyPoints: 520,
    contributionScore: 95,
    activityScore: 91,
    badges: ['⚡ Active Member', '🎯 Consistent'],
    status: 'Active',
    trend: '+18%',
  },
  {
    id: 3,
    name: 'Rohan Das',
    role: 'Bug Hunter',
    projects: 3,
    weeklyPoints: 112,
    monthlyPoints: 310,
    contributionScore: 81,
    activityScore: 75,
    badges: ['🥈 Bug Hunter'],
    status: 'Active',
    trend: '+9%',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    role: 'UI Wizard',
    projects: 3,
    weeklyPoints: 107,
    monthlyPoints: 290,
    contributionScore: 78,
    activityScore: 83,
    badges: ['🎨 UI Wizard'],
    status: 'Active',
    trend: '+11%',
  },
  {
    id: 5,
    name: 'Kabir Verma',
    role: 'Ops Contributor',
    projects: 2,
    weeklyPoints: 123,
    monthlyPoints: 410,
    contributionScore: 86,
    activityScore: 79,
    badges: ['📈 Steady Climber'],
    status: 'Away',
    trend: '+7%',
  },
]

const scoringSignals = [
  { label: 'Project-based rating', value: '35%', detail: 'Weighted from completed project work.' },
  { label: 'Contribution score', value: '25%', detail: 'Pull requests, reviews, and useful updates.' },
  { label: 'Activity based scoring', value: '20%', detail: 'Consistency across weekly check-ins.' },
  { label: 'Achievement badges', value: '20%', detail: 'Recognition bonuses and special wins.' },
]

const adminControls = [
  'Adjust ratings',
  'Boost weekly rankings',
  'Review active members',
  'Promote top contributors',
]

function Leaderboard() {
  const [viewType, setViewType] = useState('weekly')

  const scoreKey = viewType === 'weekly' ? 'weeklyPoints' : 'monthlyPoints'
  const sortedMembers = [...members].sort((a, b) => b[scoreKey] - a[scoreKey])
  const topThree = sortedMembers.slice(0, 3)
  const activeMembers = members.filter((member) => member.status === 'Active').length
  const avgContribution = Math.round(
    members.reduce((sum, member) => sum + member.contributionScore, 0) / members.length,
  )
  const avgActivity = Math.round(
    members.reduce((sum, member) => sum + member.activityScore, 0) / members.length,
  )
  const totalProjects = members.reduce((sum, member) => sum + member.projects, 0)

  return (
    <div className="leaderboard-body">
      <div className="module-wrapper">
        <header className="header-section">
          <div>
            <p className="header-copy" style={{ marginTop: 0 }}>
              A modular dashboard for rankings, scoring, analytics, and admin review.
            </p>
          </div>

          <div className="header-stats">
            <div>
              <strong>{activeMembers}</strong>
              <span>Active members</span>
            </div>
            <div>
              <strong>{totalProjects}</strong>
              <span>Projects tracked</span>
            </div>
            <div>
              <strong>{avgContribution}</strong>
              <span>Avg contribution</span>
            </div>
          </div>
        </header>

        <section className="hero-grid">

          <article className="hero-card spotlight-card">
            <div className="spotlight-left">
              <p className="eyebrow">Top contributor</p>
              <div className="spotlight-user">
                <div className="spotlight-avatar">{topThree[0]?.name.slice(0, 2)}</div>
                <div style={{ textAlign: 'left' }}>
                  <h3>{topThree[0]?.name}</h3>
                  <p>{topThree[0]?.role}</p>
                </div>
              </div>
            </div>

            <div className="spotlight-score">
              <strong>{topThree[0]?.[scoreKey]}</strong>
              <span>Current {viewType} score</span>
            </div>

            <div className="spotlight-meta">
              <span>Contribution score: {topThree[0]?.contributionScore}</span>
              <span>Activity score: {topThree[0]?.activityScore}</span>
              <span>Badges: {topThree[0]?.badges.length}</span>
            </div>
          </article>
        </section>

        <section className="rank-section" aria-labelledby="rankings-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Monthly / weekly rankings</p>
              <h2 id="rankings-title">Ranking board and top contributors section</h2>
            </div>

            <div className="tabs-container">
              <button
                type="button"
                className={`tab-btn ${viewType === 'weekly' ? 'active' : ''}`}
                onClick={() => setViewType('weekly')}
              >
                Weekly Rankings
              </button>
              <button
                type="button"
                className={`tab-btn ${viewType === 'monthly' ? 'active' : ''}`}
                onClick={() => setViewType('monthly')}
              >
                Monthly Rankings
              </button>
            </div>
          </div>

          <div className="podium-container">
            {topThree.map((member, index) => (
              <article key={member.id} className={`podium-card podium-${index + 1}`}>
                <span className="podium-rank">#{index + 1}</span>
                <div className="avatar-placeholder">{member.name.slice(0, 2)}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <strong>{member[scoreKey]} pts</strong>
              </article>
            ))}
          </div>

          <div className="quote-banner">
            <p>
              <span>Rank calculation system:</span> {sortedMembers[0]?.name} is leading the{' '}
              {viewType} board with the highest combined score.
            </p>
          </div>

          <div className="table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Member</th>
                  <th>Projects</th>
                  <th>Contribution</th>
                  <th>Badges</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((member, index) => (
                  <tr key={member.id} className="leaderboard-table-row">
                    <td className="rank-cell">#{index + 1}</td>
                    <td>
                      <div className="member-cell">
                        <span className="member-avatar">{member.name.slice(0, 2)}</span>
                        <div>
                          <strong>{member.name}</strong>
                          <span>{member.role}</span>
                        </div>
                      </div>
                    </td>
                    <td>{member.projects}</td>
                    <td>{member.contributionScore}</td>
                    <td>
                      <div className="badges-flex">
                        {member.badges.map((badge) => (
                          <span key={badge} className="badge-pill">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="points-cell">{member[scoreKey]} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="support-grid">
          <article className="info-card">
            <p className="eyebrow">Points system</p>
            <h2>Activity based scoring</h2>
            <ul className="signal-list">
              {scoringSignals.map((signal) => (
                <li key={signal.label}>
                  <strong>{signal.label}</strong>
                  <span>{signal.value}</span>
                  <p>{signal.detail}</p>
                </li>
              ))}
            </ul>
          </article>

          <article className="info-card">
            <p className="eyebrow">Performance analytics</p>
            <h2>Active members and score trends</h2>
            <div className="analytics-list">
              {members.map((member) => (
                <div key={member.id} className="analytics-row">
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.trend} this cycle</span>
                  </div>
                  <div className="analytics-bar">
                    <span style={{ width: `${member.activityScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="admin-panel">
          <div className="section-head">
            <div>
              <p className="eyebrow">Admin controls ratings</p>
              <h2>Review and adjust leaderboard settings</h2>
            </div>
          </div>

          <div className="admin-grid">
            {adminControls.map((control) => (
              <article key={control} className="admin-control-card">
                <strong>{control}</strong>
                <p>
                  This panel will be wired to the real action in a later phase once the data
                  flow is finalized.
                </p>
              </article>
            ))}
          </div>

          <div className="active-members-strip">
            <strong>Active members:</strong>
            {members.map((member) => (
              <span key={member.id} className={`member-pill ${member.status.toLowerCase()}`}>
                {member.name}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Leaderboard