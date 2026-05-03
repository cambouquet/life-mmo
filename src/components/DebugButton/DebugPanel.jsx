import { useState } from 'react'
import './DebugPanel.scss'
import SpritePickerModal from './SpritePickerModal.jsx'

const COLL_VALUES = {
  0: 'floor',
  1: 'wall',
  5: 'void',
  6: 'door',
}

const SPRITESHEET_VALUES = {
  0x00: 'tiles',
  0x01: 'sprites',
  0x02: 'mirror',
  0x03: 'table',
  0x04: 'torch',
}

export default function CellInfo({ hoveredTile, layers, collMap }) {
  const [editingField, setEditingField] = useState(null)
  const [pickerOpen, setPickerOpen] = useState(null)

  if (!hoveredTile || !layers) return null

  const { c, r } = hoveredTile
  const collValue = collMap[r]?.[c] ?? '?'
  const collName = COLL_VALUES[collValue] || `${collValue}`
  const ground = layers.ground[r]?.[c]
  const wall = layers.walls[r]?.[c]
  const obj = layers.objects[r]?.[c]
  const entity = layers.entities?.[r]?.[c]

  const handleSpriteSelect = (field, sprite) => {
    console.log(`Edited ${field} at (${c},${r}):`, sprite)
    setPickerOpen(null)
  }

  const EditableField = ({ label, value, field, onEdit }) => (
    <div className="cell-info__line">
      <strong>{label}:</strong>
      <span
        className="cell-info__value"
        onClick={() => onEdit(field)}
      >
        {value || '—'}
      </span>
    </div>
  )

  const collOptions = Object.values(COLL_VALUES)

  return (
    <div className="cell-info">
      <div className="cell-info__header">({c}, {r})</div>

      <div className="cell-info__line">
        <strong>Collision type:</strong>
        <select
          value={collName}
          onChange={(e) => console.log('Changed collision to', e.target.value)}
          className="cell-info__select"
        >
          {collOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <EditableField
        label="Ground"
        value={ground ? `${SPRITESHEET_VALUES[ground.ss] || ground.ss}` : '—'}
        field="ground"
        onEdit={() => setPickerOpen('floor')}
      />
      <EditableField
        label="Wall"
        value={wall ? `${SPRITESHEET_VALUES[wall.ss] || wall.ss}` : '—'}
        field="wall"
        onEdit={() => setPickerOpen('wall')}
      />
      <EditableField
        label="Object"
        value={obj ? `${SPRITESHEET_VALUES[obj.ss] || obj.ss}` : '—'}
        field="object"
        onEdit={() => setPickerOpen('table')}
      />
      <EditableField
        label="Entity"
        value={entity ? `${SPRITESHEET_VALUES[entity.ss] || entity.ss}` : '—'}
        field="entity"
        onEdit={() => setPickerOpen('torch')}
      />

      {pickerOpen && (
        <SpritePickerModal
          category={pickerOpen}
          onSelect={(sprite) => handleSpriteSelect(pickerOpen, sprite)}
          onClose={() => setPickerOpen(null)}
        />
      )}
    </div>
  )
}
