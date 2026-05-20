export function DebugTabs({ tab, setTab }) {
  const tabs = ['logs', 'data', 'STATE', 'actions']
  return (
    <div className="debug-tabs">
      {tabs.map(t => (
        <button
          key={t}
          className={`debug-tab ${tab === t.toLowerCase() ? 'debug-tab--active' : ''}`}
          onClick={() => setTab(t.toLowerCase())}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
