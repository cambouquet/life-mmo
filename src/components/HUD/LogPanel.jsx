export default function LogPanel({ entries }) {
  return (
    <div className="log-panel">
      <div className="log-panel__title">» Activity Log</div>
      <div className="log-panel__entries">
        {entries.map((entry, i) => (
          <div
            key={`${entry}-${i}`}
            className="log-line"
            dangerouslySetInnerHTML={{ __html: entry }}
          />
        ))}
      </div>
    </div>
  )
}
