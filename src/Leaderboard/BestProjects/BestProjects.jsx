import { useState } from 'react';
import BadgeList from '../BadgeShowcase/BadgeList';

export default function BestProjects({ projects, users }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const sortedProjects = [...projects]
    .filter(p => p.status === 'Published' || p.status === 'Approved' || p.status === 'Review')
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

  return (
    <div>
      <div className="table-card">
        <div className="table-row table-head grid-col-leaderboard-projects">
          <div>Rank</div>
          <div>Project Name</div>
          <div>Owner</div>
          <div>Rating</div>
        </div>
        {sortedProjects.map((project, index) => (
          <div 
            key={project.id} 
            className="table-row grid-col-leaderboard-projects" 
            style={{ alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setSelectedProject(project)}
          >
            <div style={{ fontSize: index < 3 ? '24px' : '18px', fontWeight: 'bold', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'inherit' }}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
            </div>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>{project.title}</strong>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>{project.owner}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{project.rating} ⭐</div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project: {selectedProject.title}</h2>
              <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="cards-grid">
                <div className="panel-card card-highlight">
                  <p className="eyebrow">Rating</p>
                  <h3>{selectedProject.rating} ⭐</h3>
                </div>
                <div className="panel-card">
                  <p className="eyebrow">Owner</p>
                  <h3>{selectedProject.owner}</h3>
                  {users && users.find(u => u.name === selectedProject.owner) && (
                    <div style={{ marginTop: '8px' }}>
                      <BadgeList badges={users.find(u => u.name === selectedProject.owner).badges} maxDisplay={2} />
                    </div>
                  )}
                </div>
                <div className="panel-card">
                  <p className="eyebrow">Submission Date</p>
                  <h3>{selectedProject.submissionDate || 'N/A'}</h3>
                </div>
              </div>

              <div>
                <p className="eyebrow">Project Description</p>
                <p style={{ marginTop: '8px', lineHeight: '1.5' }}>{selectedProject.description || 'No description provided.'}</p>
              </div>

              <div>
                <p className="eyebrow">Team Members</p>
                <p>{selectedProject.owner}{selectedProject.contributors ? `, ${selectedProject.contributors}` : ''}</p>
              </div>

              <div>
                <p className="eyebrow">Technologies Used</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {selectedProject.technologiesUsed?.map(tech => (
                    <span key={tech} className="pill" style={{ background: 'rgba(255,255,255,0.1)' }}>{tech}</span>
                  ))}
                  {(!selectedProject.technologiesUsed || selectedProject.technologiesUsed.length === 0) && '-'}
                </div>
              </div>

              {selectedProject.awards && selectedProject.awards.length > 0 && (
                <div>
                  <p className="eyebrow">Awards & Recognition</p>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px', color: '#FFD700' }}>
                    {selectedProject.awards.map(award => (
                      <li key={award}>🏆 {award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
