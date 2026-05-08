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
        ⚙
      </button>

      {open && (
        <div className="admin-menu__panel">
          <div className="admin-menu__header">Admin</div>

          <button
            className="admin-menu__item admin-menu__item--primary"
            onClick={() => onToggleGameTests?.()}
            title="Toggle game interactions playground"
          >
            Game Interactions
          </button>
        </div>
      )}
    </div>
  )
}
