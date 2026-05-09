export default function BottomToolbar({ adminOpen, onAdminToggle, onEditMap, onRecord }) {
  return (
    <div className="bottom-toolbar">
      {adminOpen && (
        <>
          <button
            className="toolbar-btn toolbar-btn--edit-map"
            onClick={onEditMap}
            title="Toggle map editor"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h7v7H4z" />
              <path d="M13 4h7v7h-7z" />
              <path d="M4 13h7v7H4z" />
              <path d="M13 13h7v7h-7z" />
            </svg>
          </button>
          <button
            className="toolbar-btn toolbar-btn--record"
            onClick={onRecord}
            title="Record scenarios"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
          </button>
        </>
      )}
      <button
        className={`toolbar-btn toolbar-btn--admin ${adminOpen ? 'toolbar-btn--active' : ''}`}
        onClick={onAdminToggle}
        title="Toggle admin panel"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>
    </div>
  )
}
