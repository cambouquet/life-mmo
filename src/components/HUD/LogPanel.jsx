export default function LogPanel({ entries }) {
  return (
    <div className="log-panel">
      <div className="log-panel__entries">
        {[...entries].reverse().map((entry, i) => (
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
