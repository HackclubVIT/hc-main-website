export default function EventsTab({ dashboardEvents, setDashboardEvents }) {
  return (
    <section className="panel-section">
      <div className="section-head">
        <div>
          <p className="eyebrow">Events</p>
          <h2>Upcoming HackClub events and deadlines</h2>
        </div>
      </div>
      <div className="panel-card">
        <div className="timeline-list">
          {dashboardEvents.map((event, index) => (
            <div key={event.title} className="timeline-item">
              <strong>{event.title}</strong>
              <input
                value={event.status}
                onChange={(eventUpdate) => setDashboardEvents((prev) => prev.map((current, idx) => idx === index ? { ...current, status: eventUpdate.target.value } : current))}
              />
              <p>{event.date} · {event.status}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
