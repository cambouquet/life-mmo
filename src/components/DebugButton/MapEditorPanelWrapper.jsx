import MapEditorPanel from './MapEditorPanel.jsx'
import './MapEditorPanelWrapper.scss'

export default function MapEditorPanelWrapper({ isOpen, ...props }) {
  if (!isOpen) return null

  return (
    <div className="map-editor-wrapper">
      <MapEditorPanel {...props} />
    </div>
  )
}
