export default function SeatOptions({ seats, onBack }) {
  return (
    <div className="seat-options">
      <div className="seat-options__header">
        <h2>Best Seat Options</h2>

        <button className="back-btn" onClick={onBack}>
          ← Back to Search
        </button>
      </div>

      <div className="seat-grid">
        {seats.map((seat) => (
          <div className="seat-card" key={seat.showtimeId}>
            <div className="seat-card__time">
              {new Date(seat.date).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>

            <div className="seat-card__movie-info">
              <div>
                <strong>Seat</strong>
                <span>{seat.seat}</span>
              </div>

              <div>
                <strong>Auditorium</strong>
                <span>{seat.auditorium}</span>
              </div>

              <div>
                <strong>Format</strong>
                <span>{seat.format}</span>
              </div>

              <div>
                <strong>Row / Column</strong>
                <span>
                  {seat.row} / {seat.column}
                </span>
              </div>
            </div>

            <a
              className="buy-btn"
              href={seat.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy Ticket
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}