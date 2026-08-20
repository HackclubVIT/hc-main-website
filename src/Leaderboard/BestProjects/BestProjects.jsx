import { useState } from 'react';
import BadgeList from '../BadgeShowcase/BadgeList';

export default function BestProjects({ projects = [], users = [] }) {
  const [selectedProject, setSelectedProject] = useState(null);

  // Sorting & Tie-breaking:
  // 1. Higher average rating
  // 2. More completed admin reviews
  // 3. Earlier submission date
  const sortedProjects = [...projects]
    .filter(p => (p.status || '').toUpperCase() !== 'REJECTED')
    .sort((a, b) => {
      const rA = parseFloat(a.rating) || 0;
      const rB = parseFloat(b.rating) || 0;
      if (rB !== rA) return rB - rA;

      const cA = Number(a.ratingCount || (Array.isArray(a.individualRatings) ? a.individualRatings.length : 0));
      const cB = Number(b.ratingCount || (Array.isArray(b.individualRatings) ? b.individualRatings.length : 0));
      if (cB !== cA) return cB - cA;

      return String(a.submissionDate || '').localeCompare(String(b.submissionDate || ''));
    });

  const top3 = sortedProjects.slice(0, 3);
  const remaining = sortedProjects.slice(3);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Top 3 Podium Cards */}
      {top3.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {top3.map((project, idx) => {
            const rankEmoji = idx === 0 ? '🥇 1st Place' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place';
            const rankColor = idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : '#CD7F32';
            const reviewsCount = Array.isArray(project.individualRatings) ? project.individualRatings.length : (project.ratingCount || 0);

            return (
              <div
                key={project.id || idx}
                onClick={() => setSelectedProject(project)}
                className="panel-card"
                style={{
                  cursor: 'pointer',
                  borderTop: `4px solid ${rankColor}`,
                  boxShadow: idx === 0 ? '0 8px 24px rgba(255, 215, 0, 0.15)' : 'none',
                  position: 'relative',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: rankColor, letterSpacing: '0.05em' }}>
                      {rankEmoji}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', color: 'var(--orange)' }}>
                      {project.category || 'General'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', margin: '0 0 6px 0', color: 'var(--text)' }}>{project.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    By {project.owner || 'Student Member'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--amber)' }}>
                      ⭐ {project.rating || '0.0'}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>/ 10</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {reviewsCount} admin review{reviewsCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard Table List */}
      <div className="table-card">
        <div className="table-row table-head" style={{ display: 'grid', gridTemplateColumns: '0.6fr 2.5fr 1.5fr 1.2fr 1fr', gap: '12px', alignItems: 'center' }}>
          <div>Rank</div>
          <div>Project Title</div>
          <div>Owner</div>
          <div>Category</div>
          <div style={{ textAlign: 'right' }}>Score</div>
        </div>

        {sortedProjects.length > 0 ? (
          sortedProjects.map((project, index) => {
            const reviewsCount = Array.isArray(project.individualRatings) ? project.individualRatings.length : (project.ratingCount || 0);
            return (
              <div 
                key={project.id || index} 
                className="table-row" 
                style={{ display: 'grid', gridTemplateColumns: '0.6fr 2.5fr 1.5fr 1.2fr 1fr', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setSelectedProject(project)}
              >
                <div style={{ fontSize: index < 3 ? '1.3rem' : '1rem', fontWeight: 'bold', color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'var(--text-muted)' }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{project.title}</strong>
                  {project.technologiesUsed && Array.isArray(project.technologiesUsed) && project.technologiesUsed.length > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {project.technologiesUsed.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ color: 'var(--text-muted)' }}>{project.owner || 'Student Member'}</div>
                <div>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--orange)' }}>
                    {project.category || 'General'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--amber)' }}>⭐ {project.rating || '0.0'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{reviewsCount} reviews</div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No project ratings yet. Projects will appear here as admins evaluate them.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PROJECT DETAILS MODAL                                                     */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '100%', maxHeight: '88vh', overflowY: 'auto', padding: '32px' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--orange)' }}>{selectedProject.category || 'PROJECT SHOWCASE'}</span>
                <h2 style={{ fontSize: '1.8rem', margin: '4px 0 0 0' }}>{selectedProject.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setSelectedProject(null)}>×</button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <div className="panel-card card-highlight" style={{ padding: '16px' }}>
                  <p className="eyebrow">Average Rating</p>
                  <h3 style={{ fontSize: '1.6rem', color: 'var(--amber)' }}>⭐ {selectedProject.rating || '0.0'} / 10</h3>
                </div>
                <div className="panel-card" style={{ padding: '16px' }}>
                  <p className="eyebrow">Owner</p>
                  <h3 style={{ fontSize: '1.2rem' }}>{selectedProject.owner}</h3>
                  {users && users.find(u => u.name === selectedProject.owner) && (
                    <div style={{ marginTop: '8px' }}>
                      <BadgeList badges={users.find(u => u.name === selectedProject.owner).badges} maxDisplay={2} />
                    </div>
                  )}
                </div>
                <div className="panel-card" style={{ padding: '16px' }}>
                  <p className="eyebrow">Submission Date</p>
                  <h3 style={{ fontSize: '1.2rem' }}>{selectedProject.submissionDate || 'N/A'}</h3>
                </div>
              </div>

              <div>
                <p className="eyebrow" style={{ color: 'var(--orange)', marginBottom: '6px' }}>Project Overview</p>
                <p style={{ lineHeight: '1.6', color: 'var(--text)', margin: 0 }}>
                  {selectedProject.description || 'No description provided.'}
                </p>
              </div>

              {selectedProject.problemStatement && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '8px', borderLeft: '3px solid var(--orange)' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text)' }}>Problem Statement</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--mute)', lineHeight: '1.5' }}>{selectedProject.problemStatement}</p>
                </div>
              )}

              {selectedProject.solution && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px 18px', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', color: 'var(--text)' }}>Solution & Architecture</h4>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--mute)', lineHeight: '1.5' }}>{selectedProject.solution}</p>
                </div>
              )}

              <div>
                <p className="eyebrow" style={{ color: 'var(--orange)', marginBottom: '8px' }}>Technologies Used</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedProject.technologiesUsed?.map(tech => (
                    <span key={tech} className="pill" style={{ background: 'rgba(255,255,255,0.06)', padding: '4px 12px' }}>{tech}</span>
                  ))}
                  {(!selectedProject.technologiesUsed || selectedProject.technologiesUsed.length === 0) && '-'}
                </div>
              </div>

              {/* Links */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                {selectedProject.github && (
                  <a
                    href={selectedProject.github.startsWith('http') ? selectedProject.github : `https://${selectedProject.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-secondary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    💻 GitHub Repo ↗
                  </a>
                )}
                {selectedProject.deployment && (
                  <a
                    href={selectedProject.deployment.startsWith('http') ? selectedProject.deployment : `https://${selectedProject.deployment}`}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-primary"
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    🚀 Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

