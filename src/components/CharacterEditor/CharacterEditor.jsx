import React, { useState } from 'react';
import { CharacterTemplate } from './CharacterTemplate';
import './CharacterEditor.scss';

export default function CharacterEditor({ initialColors, onSave, onClose, onChange }) {
  const [colors, setColors] = useState(initialColors || {
    hair: '#6030d0',
    skin: '#f8c898',
    eyes: '#8040e8',
    outfit: '#4a1090',
    stick: '#60a8ff'
  });

  const updateColor = (key, val) => {
    const next = { ...colors, [key]: val };
    setColors(next);
    if (onChange) onChange(next);
  };

  return (
    <div className="char-editor-modal">
      <div className="char-editor-content">
        <div className="char-editor-preview">
          <CharacterTemplate colors={colors} scale={6} />
          <div className="char-editor-preview-label">Mira Mirror</div>
        </div>
        
        <div className="char-editor-controls">
          <h3>Personalize</h3>
          
          <div className="control-group">
            <label>Hair</label>
            <input type="color" value={colors.hair} onChange={e => updateColor('hair', e.target.value)} />
          </div>
          
          <div className="control-group">
            <label>Skin</label>
            <input type="color" value={colors.skin} onChange={e => updateColor('skin', e.target.value)} />
          </div>

          <div className="control-group">
            <label>Eyes</label>
            <input type="color" value={colors.eyes} onChange={e => updateColor('eyes', e.target.value)} />
          </div>

          <div className="control-group">
            <label>Armor</label>
            <input type="color" value={colors.outfit} onChange={e => updateColor('outfit', e.target.value)} />
          </div>

          <div className="control-group">
            <label>Wand</label>
            <input type="color" value={colors.stick} onChange={e => updateColor('stick', e.target.value)} />
          </div>

          <div className="char-editor-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={() => onSave(colors)}>Embody</button>
          </div>
        </div>
      </div>
    </div>
  );
}
