import { useState } from 'react';
import TopMembers from './TopMembers/TopMembers';
import BestProjects from './BestProjects/BestProjects';
import WeeklyWinners from './WeeklyWinners/WeeklyWinners';
import MonthlyWinners from './MonthlyWinners/MonthlyWinners';
import BadgeShowcase from './BadgeShowcase/BadgeShowcase';
import HallOfFame from './HallOfFame/HallOfFame';

export default function Leaderboard({ users, projects, weeklyWinners, monthlyWinners }) {
  const [activeTab, setActiveTab] = useState('members');

  return (
    <section className="panel-section">
      <div className="section-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <p className="eyebrow">Leaderboards</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', width: '100%', overflowX: 'auto' }}>
          <button 
            className={`nav-link ${activeTab === 'members' ? 'active' : ''}`} 
            style={{ padding: '8px 16px', background: 'transparent', whiteSpace: 'nowrap' }}
            onClick={() => setActiveTab('members')}
          >
            Top Members
          </button>
          <button 
            className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`} 
            style={{ padding: '8px 16px', background: 'transparent', whiteSpace: 'nowrap' }}
            onClick={() => setActiveTab('projects')}
          >
            Top Projects
          </button>
          <button 
            className={`nav-link ${activeTab === 'weekly' ? 'active' : ''}`} 
            style={{ padding: '8px 16px', background: 'transparent', whiteSpace: 'nowrap' }}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Winners
          </button>
          <button 
            className={`nav-link ${activeTab === 'monthly' ? 'active' : ''}`} 
            style={{ padding: '8px 16px', background: 'transparent', whiteSpace: 'nowrap' }}
            onClick={() => setActiveTab('monthly')}
          >
            Monthly Winners
          </button>
          <button 
            className={`nav-link ${activeTab === 'badges' ? 'active' : ''}`} 
            style={{ padding: '8px 16px', background: 'transparent', whiteSpace: 'nowrap' }}
            onClick={() => setActiveTab('badges')}
          >
            Badge Showcase
          </button>
          <button 
            className={`nav-link ${activeTab === 'hallOfFame' ? 'active' : ''}`} 
            style={{ padding: '8px 16px', background: 'transparent', whiteSpace: 'nowrap' }}
            onClick={() => setActiveTab('hallOfFame')}
          >
            Hall of Fame
          </button>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        {activeTab === 'members' && <TopMembers users={users} projects={projects} />}
        {activeTab === 'projects' && <BestProjects projects={projects} users={users} />}
        {activeTab === 'weekly' && <WeeklyWinners weeklyWinners={weeklyWinners} />}
        {activeTab === 'monthly' && <MonthlyWinners monthlyWinners={monthlyWinners} />}
        {activeTab === 'badges' && <BadgeShowcase users={users} />}
        {activeTab === 'hallOfFame' && <HallOfFame monthlyWinners={monthlyWinners} />}
      </div>
    </section>
  );
}
