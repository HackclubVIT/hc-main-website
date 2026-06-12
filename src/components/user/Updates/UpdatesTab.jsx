export default function UpdatesTab({ globalAnnouncements }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Updates</p>
          <h2>Latest news from HackClub VIT Chennai</h2>
        </div>
      </div>
      <div className="announcement-grid">
        {globalAnnouncements.map((note) => (
          <div key={note.title} className="panel-card announcement-card">
            <div className="pill">{note.label}</div>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
