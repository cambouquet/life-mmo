import { useState } from 'react'
import './AdminMenu.scss'

export default function AdminMenu({ onToggleGameTests }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="admin-menu">
      {open && (
        <div className="admin-menu__top-row">
          <button
            className="admin-menu__button"
            onClick={() => {
              onToggleGameTests?.()
              setOpen(false)
            }}
            title="Toggle game interactions playground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4l3 1.5" />
            </svg>
          </button>
        </div>
      )}

      <div className="admin-menu__toggle">
        <button
          className="admin-menu__button admin-menu__button--toggle"
          onClick={() => setOpen(!open)}
          title="Toggle admin menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="admin-menu__overlay" onClick={() => setOpen(false)} />
      )}
    </div>
  )
}
