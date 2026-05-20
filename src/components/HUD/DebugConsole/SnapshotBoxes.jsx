export function SnapshotBoxes({ history, selectedIndex, setSelectedIndex, timelineRef }) {
  return (
    <div
      ref={timelineRef}
      style={{
        display: 'flex',
        gap: '4px',
        overflowX: 'auto',
        overflowY: 'hidden',
        paddingBottom: '4px',
        scrollBehavior: 'smooth',
      }}
    >
      {history.map((entry, idx) => (
        <div
          key={idx}
          data-snapshot={idx}
          onClick={() => setSelectedIndex(idx)}
          style={{
            flex: '0 0 32px',
            height: '32px',
            borderRadius: '4px',
            border:
              selectedIndex === idx
                ? '2px solid rgba(192, 132, 252, 0.8)'
                : '1px solid rgba(168, 85, 247, 0.3)',
            background:
              selectedIndex === idx
                ? 'rgba(192, 132, 252, 0.15)'
                : 'rgba(168, 85, 247, 0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '9px',
            color:
              selectedIndex === idx
                ? '#c084fc'
                : 'rgba(255, 255, 255, 0.4)',
            fontWeight: selectedIndex === idx ? '600' : '400',
            transition: 'all 0.12s',
            whiteSpace: 'nowrap',
          }}
          title={entry.timestamp.toLocaleTimeString()}
          onMouseEnter={(e) => {
            if (selectedIndex !== idx) {
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            if (selectedIndex !== idx) {
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'
            }
          }}
        >
          {idx + 1}
        </div>
      ))}
    </div>
  )
}
