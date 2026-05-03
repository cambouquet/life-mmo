import { useState } from 'react'
import './DebugPanel.scss'

const COLL_NAMES = {
  0: 'floor',
  1: 'wall',
  5: 'void',
  6: 'door',
  '?': '?'
}

const SPRITESHEET_NAMES = {
  0x00: 'tiles',
  0x01: 'sprites',
  0x02: 'mirror',
  0x03: 'table',
  0x04: 'torch',
}

export default function CellInfo({ hoveredTile, layers, collMap }) {
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')

  if (!hoveredTile || !layers) return null

  const { c, r } = hoveredTile
  const collValue = collMap[r]?.[c] ?? '?'
  const collName = COLL_NAMES[collValue] || `${collValue}`
  const ground = layers.ground[r]?.[c]
  const wall = layers.walls[r]?.[c]
  const obj = layers.objects[r]?.[c]
  const entity = layers.entities?.[r]?.[c]

  const handleEdit = (field, value) => {
    setEditingField(field)
    setEditValue(value || '')
  }

  const handleSave = (field) => {
    // TODO: Save the edited value to the map/layers
    console.log(`Edited ${field} at (${c},${r}):`, editValue)
    setEditingField(null)
  }

  const handleCancel = () => {
    setEditingField(null)
  }

  const EditableField = ({ label, value, field }) => (
    <div className="cell-info__line">
      <strong>{label}:</strong>
      {editingField === field ? (
        <div className="cell-info__edit">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
          <button onClick={() => handleSave(field)}>✓</button>
          <button onClick={handleCancel}>✕</button>
        </div>
      ) : (
        <span
          className="cell-info__value"
          onClick={() => handleEdit(field, value)}
        >
          {value || '—'}
        </span>
      )}
    </div>
  )

  return (
    <div className="cell-info">
      <div className="cell-info__header">({c}, {r})</div>
      <EditableField label="Collision type" value={collName} field="collision" />
      <EditableField label="Ground" value={ground ? `${SPRITESHEET_NAMES[ground.ss] || ground.ss}` : ''} field="ground" />
      <EditableField label="Wall" value={wall ? `${SPRITESHEET_NAMES[wall.ss] || wall.ss}` : ''} field="wall" />
      <EditableField label="Object" value={obj ? `${SPRITESHEET_NAMES[obj.ss] || obj.ss}` : ''} field="object" />
      <EditableField label="Entity" value={entity ? `${SPRITESHEET_NAMES[entity.ss] || entity.ss}` : ''} field="entity" />
    </div>
  )
}
