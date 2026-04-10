import React, { useState } from 'react';
import { CharacterTemplate } from './CharacterTemplate';
import './CharacterEditor.scss';

export default function CharacterEditor({ initialColors, onSave, onClose }) {
  const [colors, setColors] = useState(initialColors || {
    hair: '#6030d0',
    skin: '#f8c898',
    eyes: '#8040e8',
    outfit: '#4a1090',
    secondary: '#60a8ff'
  });

  const updateColor = (key, val) => setColors(prev => ({ ...prev, [key]: val }));

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
            <label>Details</label>
            <input type="color" value={colors.secondary} onChange={e => updateColor('secondary', e.target.value)} />
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
