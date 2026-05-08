import { useState } from 'react'
import './AdminMenu.scss'

export default function AdminMenu({ onToggleGameTests }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="admin-menu">
      <button
        className="admin-menu__toggle"
        onClick={() => setOpen(!open)}
        title="Admin"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" />
          <circle cx="19" cy="12" r="1" />
          <circle cx="5" cy="12" r="1" />
        </svg>
      </button>

      {open && (
        <div className="admin-menu__panel">
          <div className="admin-menu__header">Admin</div>

          <button
            className="admin-menu__item admin-menu__item--primary"
            onClick={() => onToggleGameTests?.()}
            title="Toggle game interactions playground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4l3 1.5" />
            </svg>
            Game Interactions
          </button>
        </div>
      )}
    </div>
  )
}
