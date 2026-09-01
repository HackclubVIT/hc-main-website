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

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <p className="eyebrow" style={{ color: 'var(--amber)', fontSize: '0.85rem', letterSpacing: '0.2em' }}>
          PROJECT SPOTLIGHT
        </p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', margin: '4px 0 8px 0', fontWeight: '700' }}>
          Top 3 Rated Projects
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
          The highest-rated student and club projects based on peer and admin evaluations.
        </p>
      </div>

      {/* Top 3 Big Podium Cards */}
      {top3.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '36px' }}>
          {top3.map((project, idx) => {
            const isFirst = idx === 0;
            const rankEmoji = idx === 0 ? '🥇 1st Place' : idx === 1 ? '🥈 2nd Place' : '🥉 3rd Place';
            const rankTitle = idx === 0 ? 'Top Project Winner' : idx === 1 ? 'Runner Up Project' : '3rd Place Project';
            const rankColor = idx === 0 ? '#FFD700' : idx === 1 ? '#E0E0E0' : '#CD7F32';
            const glowColor = idx === 0 ? 'rgba(255, 215, 0, 0.22)' : idx === 1 ? 'rgba(224, 224, 224, 0.16)' : 'rgba(205, 127, 50, 0.16)';
            const reviewsCount = Array.isArray(project.individualRatings) ? project.individualRatings.length : (project.ratingCount || 0);

            return (
              <div
                key={project.id || idx}
                onClick={() => setSelectedProject(project)}
                className="panel-card"
                style={{
                  cursor: 'pointer',
                  border: `2px solid ${rankColor}`,
                  boxShadow: `0 16px 36px ${glowColor}`,
                  borderRadius: '24px',
                  padding: isFirst ? '32px 28px' : '28px 24px',
                  background: isFirst 
                    ? 'radial-gradient(circle at 50% 0%, rgba(255, 215, 0, 0.12), rgba(18, 2, 2, 0.95) 75%)' 
                    : 'rgba(18, 2, 2, 0.92)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  position: 'relative',
                  transform: isFirst ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span 
                      style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: '700', 
                        color: rankColor, 
                        letterSpacing: '0.05em',
                        background: isFirst ? 'rgba(255, 215, 0, 0.16)' : 'rgba(255, 255, 255, 0.08)',
                        padding: '6px 12px',
                        borderRadius: '999px'
                      }}
                    >
                      {rankEmoji}
                    </span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: 'var(--orange)', fontWeight: '600' }}>
                      {project.category || 'General'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: isFirst ? '1.6rem' : '1.35rem', margin: '0 0 8px 0', color: '#fff', fontWeight: '700', lineHeight: 1.25 }}>
                    {project.title}
                  </h3>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Created by <strong style={{ color: 'var(--text)' }}>{project.owner || 'Student Member'}</strong>
                  </p>

                  {project.technologiesUsed && Array.isArray(project.technologiesUsed) && project.technologiesUsed.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {project.technologiesUsed.slice(0, 3).map((tech) => (
                        <span key={tech} style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2px 8px', borderRadius: '4px', color: 'var(--mute)' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Big Score Callout */}
                <div 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    borderTop: '1px solid rgba(255,255,255,0.08)', 
                    paddingTop: '16px',
                    marginTop: '8px' 
                  }}
                >
                  <div>
                    <span style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--amber)' }}>
                      ⭐ {project.rating || '0.0'}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '4px' }}>/ 10</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {reviewsCount} review{reviewsCount === 1 ? '' : 's'}
                  </span>
                </div>

                <button 
                  className="button button-outlined"
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px', border: `1px solid ${rankColor}44`, color: rankColor }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                >
                  Inspect Project Details →
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="panel-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px' }}>
          No evaluated projects found yet.
        </div>
      )}

      {/* Large Top 3 Projects Table */}
      <div className="table-card" style={{ padding: '8px', borderRadius: '18px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div 
          className="table-row table-head" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '100px 2.2fr 1.4fr 1.2fr 120px', 
            gap: '16px', 
            alignItems: 'center',
            padding: '16px 20px',
            fontSize: '0.85rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em'
          }}
        >
          <div>Rank</div>
          <div>Project Title</div>
          <div>Owner</div>
          <div>Category</div>
          <div style={{ textAlign: 'right' }}>Score</div>
        </div>

        {top3.length > 0 ? (
          top3.map((project, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const rankColor = isFirst ? '#FFD700' : isSecond ? '#C0C0C0' : '#CD7F32';
            const medal = isFirst ? '🥇' : isSecond ? '🥈' : '🥉';
            const rankLabel = isFirst ? '1st' : isSecond ? '2nd' : '3rd';
            const reviewsCount = Array.isArray(project.individualRatings) ? project.individualRatings.length : (project.ratingCount || 0);

            return (
              <div 
                key={project.id || index} 
                className="table-row" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '100px 2.2fr 1.4fr 1.2fr 120px', 
                  gap: '16px', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  padding: '20px 20px',
                  borderBottom: index < 2 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  background: isFirst ? 'rgba(255, 215, 0, 0.03)' : 'transparent',
                  transition: 'background 0.2s ease, transform 0.2s ease'
                }}
                onClick={() => setSelectedProject(project)}
              >
                {/* Rank */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{medal}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: rankColor }}>{rankLabel}</span>
                </div>

                {/* Title */}
                <div>
                  <strong style={{ fontSize: '1.2rem', color: '#fff', display: 'block', marginBottom: '2px' }}>{project.title}</strong>
                  {project.technologiesUsed && Array.isArray(project.technologiesUsed) && project.technologiesUsed.length > 0 && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {project.technologiesUsed.slice(0, 3).join(' • ')}
                    </div>
                  )}
                </div>

                {/* Owner */}
                <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{project.owner || 'Student Member'}</div>

                {/* Category */}
                <div>
                  <span style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', color: 'var(--orange)', fontWeight: '600' }}>
                    {project.category || 'General'}
                  </span>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--amber)' }}>⭐ {project.rating || '0.0'}</div>
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

