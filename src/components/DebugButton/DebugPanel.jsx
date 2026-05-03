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
    // TODO: Save sprite to map data
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

  const getSpriteUrl = (ss) => {
    const ssHex = ss.toString(16).padStart(2, '0')
    const ssNames = {
      '00': 'ss00_floor.png',
      '01': 'ss01_wall.png',
      '02': 'ss02_mirror.png',
      '03': 'ss03_table.png',
      '04': 'ss04_torch.png',
    }
    return `/src/assets/sprites/${ssNames[ssHex] || ''}`
  }

  const getSpriteSize = (ss) => {
    if (ss === 0x02) return 32 // mirror
    if (ss === 0x03) return 32 // table
    return 16 // floor, wall, torch
  }

  return (
    <div className="cell-info">
      <div className="cell-info__header">({c}, {r})</div>

      <div className="cell-info__preview">
        <div className="cell-info__preview-layers">
          <div className="cell-info__preview-col">
            <div className="cell-info__layer-label">Layer 0</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('floor')}>
              <strong>Ground</strong>
              {ground ? (
                <div className="cell-info__sprite-large" style={{ backgroundImage: `url(${getSpriteUrl(ground.ss)})`, backgroundPosition: `0 ${ground.row * -16}px` }} />
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
            <div className="cell-info__layer-label">Layer 1</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('wall')}>
              <strong>Wall</strong>
              {wall ? (
                <div className="cell-info__sprite-large" style={{ backgroundImage: `url(${getSpriteUrl(wall.ss)})`, backgroundPosition: `0 ${wall.row * -16}px` }} />
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
          </div>
          <div className="cell-info__preview-col">
            <div className="cell-info__layer-label">Layer 2</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('table')}>
              <strong>Object</strong>
              {obj ? (
                <div className="cell-info__sprite-large" style={{ backgroundImage: `url(${getSpriteUrl(obj.ss)})`, backgroundPosition: `0 ${obj.row * -32}px` }} />
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
            <div className="cell-info__layer-label">Layer 3</div>
            <button className="cell-info__preview-item" onClick={() => setPickerOpen('torch')}>
              <strong>Entity</strong>
              {entity ? (
                <div className="cell-info__sprite-large" style={{ backgroundImage: `url(${getSpriteUrl(entity.ss)})`, backgroundPosition: `0 ${entity.row * -16}px` }} />
              ) : (
                <div className="cell-info__sprite-large cell-info__sprite-empty" />
              )}
            </button>
          </div>
        </div>

        <div className="cell-info__render">
          <div className="cell-info__render-title">Cell Render</div>
          <div className="cell-info__render-view" style={{ position: 'relative' }}>
            {ground && (
              <div style={{ position: 'absolute', width: '96px', height: '96px', backgroundImage: `url(${getSpriteUrl(ground.ss)})`, backgroundPosition: `0 ${ground.row * -16}px`, backgroundSize: '16px 16px', backgroundRepeat: 'no-repeat', backgroundOrigin: 'content-box' }} />
            )}
            {wall && (
              <div style={{ position: 'absolute', width: '96px', height: '96px', backgroundImage: `url(${getSpriteUrl(wall.ss)})`, backgroundPosition: `0 ${wall.row * -16}px`, backgroundSize: '16px 16px', backgroundRepeat: 'no-repeat', backgroundOrigin: 'content-box' }} />
            )}
            {obj && (
              <div style={{ position: 'absolute', width: '96px', height: '96px', backgroundImage: `url(${getSpriteUrl(obj.ss)})`, backgroundPosition: `0 ${obj.row * -32}px`, backgroundSize: '32px 32px', backgroundRepeat: 'no-repeat', backgroundOrigin: 'content-box' }} />
            )}
            {entity && (
              <div style={{ position: 'absolute', width: '96px', height: '96px', backgroundImage: `url(${getSpriteUrl(entity.ss)})`, backgroundPosition: `0 ${entity.row * -16}px`, backgroundSize: '16px 16px', backgroundRepeat: 'no-repeat', backgroundOrigin: 'content-box' }} />
            )}
          </div>
        </div>
      </div>


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
