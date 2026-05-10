import { useState } from 'react'
import MapEditorPanel from './MapEditorPanel.jsx'
import './MapEditorPanelWrapper.scss'

export default function MapEditorPanelWrapper({ isOpen, ...props }) {
  const [activeMenu, setActiveMenu] = useState('tiles')

  if (!isOpen) return null

  return (
    <div className="map-editor-bars">
      <div className="map-editor-bar">
        <MapEditorPanel activeMenu={activeMenu} onMenuChange={setActiveMenu} {...props} />
      </div>
    </div>
  )
}
