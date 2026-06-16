import { useState } from 'react';

export default function AdminAnnouncements({ announcements, setAnnouncements, addAnnouncement }) {
  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', body: '', label: 'Live' });
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ title: '', body: '', label: '' });

  const deleteAnnouncement = (index) => {
    if(window.confirm('Are you sure you want to delete this announcement? It will be removed for all users.')) {
      const newAnns = [...announcements];
      newAnns.splice(index, 1);
      setAnnouncements(newAnns);
    }
  };

  const saveEdit = (index) => {
    const newAnns = [...announcements];
    newAnns[index] = editData;
    setAnnouncements(newAnns);
    setEditIndex(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addAnnouncement(newAnnouncement);
    setNewAnnouncement({ title: '', body: '', label: 'Live' });
    setShowForm(false);
  };

  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Announcements / Notifications</p>
          <h2>Broadcast updates to the HackClub community</h2>
        </div>
        <button className="button button-secondary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Post update'}
        </button>
      </div>

      {showForm && (
        <div className="panel-card" style={{ marginBottom: '24px' }}>
          <h3>Create New Announcement</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            <label>
              Title
              <input 
                type="text" 
                value={newAnnouncement.title} 
                onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                placeholder="e.g. Hackathon next week!"
                required
                style={{ marginTop: '8px' }}
              />
            </label>
            <label>
              Message
              <textarea 
                value={newAnnouncement.body} 
                onChange={e => setNewAnnouncement({...newAnnouncement, body: e.target.value})}
                rows="3"
                placeholder="Details of the announcement..."
                required
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px', marginTop: '8px',
                  border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)', 
                  color: 'var(--text)', fontFamily: 'inherit', resize: 'vertical'
                }}
              />
            </label>
            <label>
              Label/Tag
              <select 
                value={newAnnouncement.label} 
                onChange={e => setNewAnnouncement({...newAnnouncement, label: e.target.value})}
                style={{ 
                  marginTop: '8px', width: '100%', padding: '10px', borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <option value="Live" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Live</option>
                <option value="Urgent" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Urgent</option>
                <option value="Winner" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Winner</option>
                <option value="Update" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Update</option>
              </select>
            </label>
            <button className="button button-primary" type="submit" style={{ alignSelf: 'flex-start' }}>Post Announcement</button>
          </form>
        </div>
      )}

      <div className="announcement-grid">
        {announcements.map((note, index) => (
          <div key={index} className="panel-card announcement-card" style={{ display: 'flex', flexDirection: 'column' }}>
            {editIndex === index ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <input 
                  type="text" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                />
                <textarea 
                  value={editData.body} onChange={e => setEditData({...editData, body: e.target.value})} rows="3"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', resize: 'vertical' }}
                />
                <select 
                  value={editData.label} onChange={e => setEditData({...editData, label: e.target.value})}
                  style={{ padding: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <option value="Live" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Live</option>
                  <option value="Urgent" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Urgent</option>
                  <option value="Winner" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Winner</option>
                  <option value="Update" style={{ backgroundColor: '#1e1e1e', color: 'white' }}>Update</option>
                </select>
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px' }}>
                  <button className="button button-primary" onClick={() => saveEdit(index)} style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Save</button>
                  <button className="button button-secondary" onClick={() => setEditIndex(null)} style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="pill" style={{ 
                    backgroundColor: note.label === 'Urgent' ? 'rgba(255,85,85,0.2)' : note.label === 'Winner' ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)',
                    color: note.label === 'Urgent' ? '#ff5555' : note.label === 'Winner' ? '#ffd700' : 'var(--text)'
                  }}>
                    {note.label}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditIndex(index); setEditData(note); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Edit</button>
                    <button onClick={() => deleteAnnouncement(index)} style={{ background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Delete</button>
                  </div>
                </div>
                <h3 style={{ marginTop: '12px' }}>{note.title}</h3>
                <p>{note.body}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
