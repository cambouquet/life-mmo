import { PageButton } from './ActionButton.jsx'

export function NavigateSection({ screenDebug, executeAction }) {
  if (!screenDebug?.pages) return null
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ fontSize: '11px', color: '#c084fc', marginBottom: '6px', fontWeight: 'bold' }}>
        NAVIGATE
      </div>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        {screenDebug.pages.map((page) => (
          <PageButton
            key={page}
            page={page}
            isActive={screenDebug.activePage === page}
            onClick={() => executeAction('goToPage', page)}
          />
        ))}
      </div>
    </div>
  )
}
