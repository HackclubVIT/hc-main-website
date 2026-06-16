export default function NotificationsTab({ globalAnnouncements }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Notifications</p>
          <h2>Your personal notifications</h2>
        </div>
      </div>
      <div className="list-card">
        {globalAnnouncements.map((note) => (
          <div key={note.title} className="list-item">
            <div>
              <strong>{note.title}</strong>
              <input
                value={note.body}
                readOnly
              />
            </div>
            <span className="pill">{note.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
