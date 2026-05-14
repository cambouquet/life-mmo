export default function AdminToolbar({ isOpen, onToggle, onEditMap, onRecord }) {
  if (!isOpen) return null

  return (
    <div className="admin-toolbar">
      <button
        className="admin-toolbar__btn admin-toolbar__btn--edit-map"
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
        className="admin-toolbar__btn admin-toolbar__btn--record"
        onClick={onRecord}
        title="Record scenarios"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      </button>
    </div>
  )
}
