

import { useState } from 'react';
import { api } from '../../../api';

export default function AdminManageProjects({ projects = [], setProjects }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Rating state for active review
  const [ratingValue, setRatingValue] = useState(8.0);
  const [ratingComment, setRatingComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [ratingMessage, setRatingMessage] = useState('');
  const [enlargedImage, setEnlargedImage] = useState(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.owner || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.technologiesUsed || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus !== 'All') {
      const normStatus = (p.status || '').toUpperCase();
      const normFilter = selectedStatus.toUpperCase();
      matchesStatus = normStatus === normFilter || (normFilter === 'PENDING' && normStatus.includes('PENDING'));
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setRatingMessage('');
    setEnlargedImage(null);

    // If current project has ratings, check if current user already rated
    const ratings = Array.isArray(project.individualRatings) ? project.individualRatings : [];
    if (ratings.length > 0) {
      setRatingValue(parseFloat(ratings[0].rating) || 8.0);
      setRatingComment(ratings[0].comment || '');
    } else {
      setRatingValue(8.0);
      setRatingComment('');
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    const numeric = parseFloat(ratingValue);
    if (isNaN(numeric) || numeric < 0 || numeric > 10) {
      window.alert('Rating must be a number between 0 and 10.');
      return;
    }

    setIsSubmittingRating(true);
    setRatingMessage('');
    try {
      const res = await api.rateProject(selectedProject.id, numeric, ratingComment);
      const updated = res.project || {
        ...selectedProject,
        rating: numeric.toFixed(1),
        individualRatings: [{ rating: numeric, comment: ratingComment }]
      };

      setProjects(prev => prev.map(p => String(p.id) === String(selectedProject.id) ? { ...p, ...updated } : p));
      setSelectedProject(prev => ({ ...prev, ...updated }));
      setRatingMessage('✅ Rating and review saved successfully!');
    } catch (err) {
      window.alert(err.message || 'Failed to submit rating.');
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    const updated = projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p);
    setProjects(updated);
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(prev => ({ ...prev, status: newStatus }));
    }
  };

  const deleteProject = (id) => {
    if (window.confirm('Are you sure you want to delete this project permanently?')) {
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject && selectedProject.id === id) {
        setSelectedProject(null);
      }
    }
  };

  // Summary Metrics
  const totalProjects = projects.length;
  const pendingCount = projects.filter(p => (p.status || '').toUpperCase().includes('PENDING')).length;
  const reviewedCount = projects.filter(p => (p.status || '').toUpperCase() === 'REVIEWED' || (p.status || '').toUpperCase() === 'APPROVED').length;
  const validRatings = projects.map(p => parseFloat(p.rating)).filter(r => !isNaN(r) && r > 0);
  const avgOverallScore = validRatings.length > 0 ? (validRatings.reduce((s, r) => s + r, 0) / validRatings.length).toFixed(1) : '0.0';

  return (
    <section className="panel-section" style={{ animation: 'fadeIn 0.4s ease' }}>
      <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <p className="eyebrow" style={{ color: 'var(--orange)', fontFamily: 'monospace' }}>ADMIN EVALUATION PORTAL</p>
          <h2>Project Submissions & Reviews</h2>
          <p className="subtitle">Inspect complete candidate submissions, evaluate live deployments & codebases, and rate out of 10.</p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="cards-grid" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="panel-card" style={{ padding: '18px 24px' }}>
          <p className="eyebrow" style={{ color: 'var(--mute)' }}>Total Submissions</p>
          <h3 style={{ fontSize: '2rem', margin: '4px 0 0 0' }}>{totalProjects}</h3>
        </div>
        <div className="panel-card" style={{ padding: '18px 24px', borderLeft: '4px solid var(--amber)' }}>
          <p className="eyebrow" style={{ color: 'var(--amber)' }}>Pending Review</p>
          <h3 style={{ fontSize: '2rem', margin: '4px 0 0 0' }}>{pendingCount}</h3>
        </div>
        <div className="panel-card" style={{ padding: '18px 24px', borderLeft: '4px solid var(--success)' }}>
          <p className="eyebrow" style={{ color: 'var(--success)' }}>Reviewed & Approved</p>
          <h3 style={{ fontSize: '2rem', margin: '4px 0 0 0' }}>{reviewedCount}</h3>
        </div>
        <div className="panel-card" style={{ padding: '18px 24px', borderLeft: '4px solid var(--highlight)' }}>
          <p className="eyebrow" style={{ color: 'var(--highlight)' }}>Average Project Rating</p>
          <h3 style={{ fontSize: '2rem', margin: '4px 0 0 0' }}>⭐ {avgOverallScore} / 10</h3>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="panel-card" style={{ padding: '18px 20px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by project title, student/team, or tech stack..."
            style={{ width: '100%', padding: '10px 14px' }}
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: 'var(--text)',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="AI / Machine Learning">AI / Machine Learning</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Systems & IoT">Systems & IoT</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Cybersecurity & Tools">Cybersecurity & Tools</option>
            <option value="Open Source">Open Source</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.02)',
              color: 'var(--text)',
              cursor: 'pointer'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="REJECTED">Rejected</option>
            <option value="Approved">Approved / Published</option>
          </select>
        </div>
      </div>

      {/* Projects Table List */}
      <div className="table-card">
        <div className="table-row table-head" style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1.2fr 1.2fr 1fr 1.2fr', gap: '12px', alignItems: 'center' }}>
          <div>Project & Tech</div>
          <div>Submitted By</div>
          <div>Category</div>
          <div>Status</div>
          <div>Rating</div>
          <div style={{ textAlign: 'right' }}>Action</div>
        </div>

        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((project) => {
            const reviewsCount = Array.isArray(project.individualRatings) ? project.individualRatings.length : (project.ratingCount || 0);
            return (
              <div 
                key={project.id} 
                className="table-row" 
                style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.5fr 1.2fr 1.2fr 1fr 1.2fr', gap: '12px', alignItems: 'center' }}
              >
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text)' }}>{project.title}</strong>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {Array.isArray(project.technologiesUsed) ? project.technologiesUsed.join(', ') : 'Tech stack not specified'}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: '500' }}>{project.owner || 'Student Member'}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{project.submissionDate || 'Recently'}</div>
                </div>

                <div>
                  <span style={{ fontSize: '0.8rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--orange)' }}>
                    {project.category || 'General'}
                  </span>
                </div>

                <div>
                  <span className={`status-pill status-${(project.status || 'pending').toLowerCase().replace('_', '')}`}>
                    {project.status === 'PENDING_REVIEW' ? 'Pending Review' : project.status === 'UNDER_REVIEW' ? 'Under Review' : project.status}
                  </span>
                </div>

                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.05rem' }}>⭐ {project.rating || '0.0'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{reviewsCount} admin rating{reviewsCount === 1 ? '' : 's'}</div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    className="button button-primary"
                    style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    onClick={() => handleOpenProject(project)}
                  >
                    View Project
                  </button>
                  <button
                    className="button button-outlined"
                    style={{ padding: '6px 10px', fontSize: '0.85rem', color: '#ff5555', borderColor: 'transparent', background: 'rgba(255,85,85,0.08)' }}
                    onClick={() => deleteProject(project.id)}
                    title="Delete Project"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No project submissions found matching the criteria.
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* COMPLETE PROJECT VIEW & EVALUATION MODAL                                  */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '850px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '36px', border: '1px solid rgba(255,68,68,0.25)' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--orange)', fontFamily: 'monospace' }}>
                  {selectedProject.category || 'PROJECT EVALUATION'}
                </span>
                <h2 style={{ fontSize: '2rem', marginTop: '6px', marginBottom: '6px' }}>{selectedProject.title}</h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <span>Submitted by: <strong style={{ color: 'var(--text)' }}>{selectedProject.owner}</strong></span>
                  <span>•</span>
                  <span>Date: {selectedProject.submissionDate || 'N/A'}</span>
                  <span>•</span>
                  <span className={`status-pill status-${(selectedProject.status || 'pending').toLowerCase().replace('_', '')}`}>
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedProject(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.8rem', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Average</span>
                <h3 style={{ fontSize: '1.6rem', margin: '4px 0 0 0', color: 'var(--amber)' }}>⭐ {selectedProject.rating || '0.0'} / 10</h3>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Review Progress</span>
                <h3 style={{ fontSize: '1.6rem', margin: '4px 0 0 0' }}>
                  {Array.isArray(selectedProject.individualRatings) ? selectedProject.individualRatings.length : (selectedProject.ratingCount || 0)} Admins Rated
                </h3>
              </div>
            </div>

            {/* Project Information & Description */}
            <div style={{ display: 'grid', gap: '20px', marginBottom: '28px' }}>
              <div>
                <h4 style={{ color: 'var(--orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Project Overview</h4>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text)', margin: 0 }}>
                  {selectedProject.description || 'No overview provided.'}
                </p>
              </div>

              {selectedProject.problemStatement && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '8px', borderLeft: '3px solid var(--orange)' }}>
                  <h4 style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '6px' }}>📌 Problem Statement</h4>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--mute)', margin: 0 }}>
                    {selectedProject.problemStatement}
                  </p>
                </div>
              )}

              {selectedProject.solution && (
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '8px', borderLeft: '3px solid var(--success)' }}>
                  <h4 style={{ color: 'var(--text)', fontSize: '0.95rem', marginBottom: '6px' }}>💡 Solution & Architecture</h4>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--mute)', margin: 0 }}>
                    {selectedProject.solution}
                  </p>
                </div>
              )}

              {/* Technologies Used */}
              <div>
                <h4 style={{ color: 'var(--orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Technologies Used</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Array.isArray(selectedProject.technologiesUsed) && selectedProject.technologiesUsed.length > 0 ? (
                    selectedProject.technologiesUsed.map((tech, idx) => (
                      <span key={idx} className="pill" style={{ background: 'rgba(255,255,255,0.06)', padding: '6px 14px', fontSize: '0.85rem' }}>
                        {tech}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Not specified</span>
                  )}
                </div>
              </div>

              {/* External Links */}
              <div>
                <h4 style={{ color: 'var(--orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Project Links</h4>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {selectedProject.github ? (
                    <a
                      href={selectedProject.github.startsWith('http') ? selectedProject.github : `https://${selectedProject.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-secondary"
                      style={{ padding: '10px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      💻 Open GitHub Repository ↗
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', alignSelf: 'center' }}>GitHub repository not provided</span>
                  )}

                  {selectedProject.deployment ? (
                    <a
                      href={selectedProject.deployment.startsWith('http') ? selectedProject.deployment : `https://${selectedProject.deployment}`}
                      target="_blank"
                      rel="noreferrer"
                      className="button button-primary"
                      style={{ padding: '10px 18px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      🚀 Open Live Project ↗
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', alignSelf: 'center' }}>Live deployment not provided</span>
                  )}
                </div>
              </div>

              {/* Screenshots Gallery */}
              {Array.isArray(selectedProject.screenshots) && selectedProject.screenshots.length > 0 && (
                <div>
                  <h4 style={{ color: 'var(--orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Project Screenshots</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {selectedProject.screenshots.map((imgUrl, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setEnlargedImage(imgUrl)}
                        style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', height: '130px', background: '#000' }}
                      >
                        <img src={imgUrl} alt={`Screenshot ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo Video */}
              {selectedProject.demoVideoUrl && (
                <div>
                  <h4 style={{ color: 'var(--orange)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Demo Video</h4>
                  <a href={selectedProject.demoVideoUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--highlight)' }}>
                    📺 Watch Demo Video ({selectedProject.demoVideoUrl}) ↗
                  </a>
                </div>
              )}
            </div>

            {/* ===================================================================== */}
            {/* ADMIN RATING FORM SECTION                                             */}
            {/* ===================================================================== */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem' }}>⭐ Rate This Project (Out of 10)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Your evaluation directly determines this project&apos;s leaderboard ranking. Each admin submits one authoritative score.
              </p>

              {ratingMessage && (
                <div style={{ background: 'rgba(46,125,50,0.15)', border: '1px solid var(--success)', color: '#81c784', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                  {ratingMessage}
                </div>
              )}

              <form onSubmit={handleRatingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Score (0.0 to 10.0):</span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--amber)', fontFamily: 'monospace' }}>
                      {parseFloat(ratingValue).toFixed(1)} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={ratingValue}
                    onChange={(e) => setRatingValue(parseFloat(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--orange)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>0 (Poor)</span>
                    <span>5 (Average)</span>
                    <span>10 (Masterpiece)</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.9rem' }}>
                    Evaluation Comments / Feedback (Optional):
                    <textarea
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      rows="2"
                      placeholder="Share strengths, code quality observations, or suggestions..."
                      style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '6px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        color: 'var(--text)',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button className="button button-primary" type="submit" disabled={isSubmittingRating}>
                    {isSubmittingRating ? 'Saving Evaluation...' : 'Submit / Update Rating'}
                  </button>
                </div>
              </form>
            </div>

            {/* Individual Ratings List */}
            {Array.isArray(selectedProject.individualRatings) && selectedProject.individualRatings.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Admin Evaluation Breakdown ({selectedProject.individualRatings.length})
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedProject.individualRatings.map((r, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{r.user}</strong>
                        {r.comment && <p style={{ margin: '2px 0 0 0', fontSize: '0.85rem', color: 'var(--mute)' }}>"{r.comment}"</p>}
                      </div>
                      <span style={{ fontWeight: 'bold', color: 'var(--amber)' }}>⭐ {parseFloat(r.rating).toFixed(1)} / 10</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Management Actions */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="button button-secondary"
                  onClick={() => handleStatusChange(selectedProject.id, 'UNDER_REVIEW')}
                  style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                >
                  Mark Under Review
                </button>
                <button
                  className="button button-primary"
                  onClick={() => handleStatusChange(selectedProject.id, 'REVIEWED')}
                  style={{ fontSize: '0.85rem', padding: '6px 12px', background: 'var(--success)', borderColor: 'var(--success)', color: '#fff' }}
                >
                  Mark Reviewed
                </button>
                <button
                  className="button button-outlined"
                  onClick={() => handleStatusChange(selectedProject.id, 'REJECTED')}
                  style={{ fontSize: '0.85rem', padding: '6px 12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                >
                  Reject
                </button>
              </div>

              <button className="button button-outlined" onClick={() => setSelectedProject(null)}>
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enlarged Screenshot Modal */}
      {enlargedImage && (
        <div className="modal-backdrop" onClick={() => setEnlargedImage(null)} style={{ zIndex: 10000 }}>
          <div style={{ maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <img src={enlargedImage} alt="Enlarged" style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '12px', border: '1px solid #fff' }} />
            <button className="button button-primary" onClick={() => setEnlargedImage(null)} style={{ marginTop: '12px', display: 'block', margin: '12px auto 0' }}>
              Close Preview
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

