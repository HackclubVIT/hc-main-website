

import { useState } from 'react';
import { api } from '../../../api';

export default function ProjectsTab({ 
  dashboardProjects, 
  setDashboardProjects, 
  setGlobalUploads, 
  showAddProject, 
  setShowAddProject, 
  globalProfile 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    technologies: 'React, Node.js, CSS',
    problemStatement: '',
    solution: '',
    github: '',
    deployment: '',
    screenshotUrl: '',
    demoVideoUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide a Project Title and Description.');
      return;
    }

    const techArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const screenshots = formData.screenshotUrl.trim() ? [formData.screenshotUrl.trim()] : [];

    const projectPayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      technologiesUsed: techArray.length > 0 ? techArray : ['React', 'CSS'],
      problemStatement: formData.problemStatement.trim() || null,
      solution: formData.solution.trim() || null,
      github: formData.github.trim() || null,
      deployment: formData.deployment.trim() || null,
      screenshots,
      demoVideoUrl: formData.demoVideoUrl.trim() || null,
      owner: globalProfile?.name || 'Member',
      status: 'PENDING_REVIEW'
    };

    setLoading(true);
    try {
      const res = await api.submitProject(projectPayload);
      const createdProject = res.project || {
        ...projectPayload,
        id: Date.now(),
        rating: '0.0',
        ratingCount: 0,
        submissionDate: new Date().toISOString().split('T')[0]
      };

      setDashboardProjects(prev => [createdProject, ...prev]);
      setFormData({
        title: '',
        description: '',
        category: 'Web Development',
        technologies: 'React, Node.js, CSS',
        problemStatement: '',
        solution: '',
        github: '',
        deployment: '',
        screenshotUrl: '',
        demoVideoUrl: ''
      });
      setShowAddProject(false);
      setSuccess('🎉 Project submitted successfully! It is now pending admin review.');
    } catch (err) {
      setError(err.message || 'Failed to submit project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">My Projects</p>
          <h2>Your uploaded projects and submissions</h2>
        </div>
        <button 
          className="button button-primary" 
          type="button" 
          onClick={() => { setShowAddProject(!showAddProject); setError(''); }}
        >
          {showAddProject ? 'Cancel' : '+ Submit Project'}
        </button>
      </div>

      {success && (
        <div style={{ background: 'rgba(46,125,50,0.15)', border: '1px solid var(--success)', color: '#81c784', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px' }}>
          {success}
        </div>
      )}

      {showAddProject && (
        <div className="panel-card" style={{ marginBottom: '28px', padding: '28px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '1.4rem' }}>Submit a New Project</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
            Provide complete details for admin evaluation and leaderboard ranking.
          </p>

          {error && (
            <div style={{ background: 'rgba(172,18,12,0.15)', border: '1px solid var(--danger)', color: '#ffb4ab', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="two-col-grid" style={{ gap: '16px' }}>
              <label>
                Project Title *
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} 
                  placeholder="e.g. AI Fertilizer Recommendation System"
                  required 
                  style={{ marginTop: '8px' }}
                />
              </label>

              <label>
                Category *
                <select
                  value={formData.category}
                  onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
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
                    cursor: 'pointer'
                  }}
                >
                  <option value="Web Development" style={{ backgroundColor: '#020000' }}>Web Development</option>
                  <option value="AI / Machine Learning" style={{ backgroundColor: '#020000' }}>AI / Machine Learning</option>
                  <option value="Mobile App Development" style={{ backgroundColor: '#020000' }}>Mobile App Development</option>
                  <option value="Systems & IoT" style={{ backgroundColor: '#020000' }}>Systems & IoT</option>
                  <option value="UI/UX Design" style={{ backgroundColor: '#020000' }}>UI/UX Design</option>
                  <option value="Cybersecurity & Tools" style={{ backgroundColor: '#020000' }}>Cybersecurity & Tools</option>
                  <option value="Open Source" style={{ backgroundColor: '#020000' }}>Open Source</option>
                </select>
              </label>
            </div>

            <label>
              Short Project Description *
              <textarea 
                value={formData.description} 
                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} 
                rows="2" 
                placeholder="Brief summary of what this project does..."
                required 
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', marginTop: '8px',
                  border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', 
                  color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </label>

            <div className="two-col-grid" style={{ gap: '16px' }}>
              <label>
                Problem Statement
                <textarea 
                  value={formData.problemStatement} 
                  onChange={e => setFormData(p => ({ ...p, problemStatement: e.target.value }))} 
                  rows="3" 
                  placeholder="What specific issue or challenge does this project address?"
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px', marginTop: '8px',
                    border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', 
                    color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical'
                  }}
                />
              </label>

              <label>
                Project Solution & Overview
                <textarea 
                  value={formData.solution} 
                  onChange={e => setFormData(p => ({ ...p, solution: e.target.value }))} 
                  rows="3" 
                  placeholder="How does your architecture or solution solve the problem?"
                  style={{
                    width: '100%', padding: '12px', borderRadius: '8px', marginTop: '8px',
                    border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', 
                    color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical'
                  }}
                />
              </label>
            </div>

            <label>
              Technologies / Tech Stack (comma separated)
              <input 
                type="text" 
                value={formData.technologies} 
                onChange={e => setFormData(p => ({ ...p, technologies: e.target.value }))} 
                placeholder="e.g. Python, FastAPI, React, PyTorch, Neon PostgreSQL"
                style={{ marginTop: '8px' }}
              />
            </label>

            <div className="two-col-grid" style={{ gap: '16px' }}>
              <label>
                GitHub Repository Link
                <input 
                  type="url" 
                  value={formData.github} 
                  onChange={e => setFormData(p => ({ ...p, github: e.target.value }))} 
                  placeholder="https://github.com/username/project"
                  style={{ marginTop: '8px' }}
                />
              </label>
              <label>
                Live Deployment / Demo URL
                <input 
                  type="url" 
                  value={formData.deployment} 
                  onChange={e => setFormData(p => ({ ...p, deployment: e.target.value }))} 
                  placeholder="https://myproject.vercel.app"
                  style={{ marginTop: '8px' }}
                />
              </label>
            </div>

            <div className="two-col-grid" style={{ gap: '16px' }}>
              <label>
                Screenshot Image URL
                <input 
                  type="url" 
                  value={formData.screenshotUrl} 
                  onChange={e => setFormData(p => ({ ...p, screenshotUrl: e.target.value }))} 
                  placeholder="https://imgur.com/screenshot.png"
                  style={{ marginTop: '8px' }}
                />
              </label>
              <label>
                Demo Video Link (YouTube / Loom)
                <input 
                  type="url" 
                  value={formData.demoVideoUrl} 
                  onChange={e => setFormData(p => ({ ...p, demoVideoUrl: e.target.value }))} 
                  placeholder="https://youtube.com/watch?v=..."
                  style={{ marginTop: '8px' }}
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button className="button button-primary" type="submit" disabled={loading}>
                {loading ? 'Submitting Project...' : 'Submit Project for Evaluation'}
              </button>
              <button 
                className="button button-outlined" 
                type="button" 
                disabled={loading} 
                onClick={() => setShowAddProject(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="list-card">
        {dashboardProjects && dashboardProjects.length > 0 ? (
          dashboardProjects.map((project, index) => (
            <div key={project.id || project.title || index} className="list-item" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '1.15rem' }}>{project.title}</strong>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'var(--orange)'
                    }}>
                      {project.category || 'General'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    By {project.owner || 'You'} · {project.submissionDate || 'Recently submitted'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`status-pill status-${(project.status || 'pending').toLowerCase().replace('_', '')}`}>
                    {project.status === 'PENDING_REVIEW' ? 'Pending Review' : project.status === 'UNDER_REVIEW' ? 'Under Review' : project.status}
                  </span>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    ⭐ {project.rating || '0.0'} / 10
                  </div>
                </div>
              </div>

              {project.description && (
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--mute)', lineHeight: '1.5' }}>
                  {project.description}
                </p>
              )}

              {project.technologiesUsed && Array.isArray(project.technologiesUsed) && project.technologiesUsed.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {project.technologiesUsed.map((tech, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {project.github && (
                    <a href={project.github.startsWith('http') ? project.github : `https://${project.github}`} target="_blank" rel="noreferrer" style={{ color: 'var(--highlight)', textDecoration: 'none' }}>
                      GitHub ↗
                    </a>
                  )}
                  {project.deployment && (
                    <a href={project.deployment.startsWith('http') ? project.deployment : `https://${project.deployment}`} target="_blank" rel="noreferrer" style={{ color: 'var(--highlight)', textDecoration: 'none' }}>
                      Live Demo ↗
                    </a>
                  )}
                </div>
                <span style={{ color: 'var(--text-muted)' }}>
                  {project.ratingCount ? `${project.ratingCount} admin reviews` : 'Awaiting reviews'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No project submissions yet. Click "+ Submit Project" above to submit your first project!
          </div>
        )}
      </div>
    </section>
  );
}

