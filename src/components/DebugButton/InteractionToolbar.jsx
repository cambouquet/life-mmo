import { INTERACTIONS } from './interactionsList.jsx'

export function InteractionToolbar({ selectedInteraction, onInteraction }) {
  return (
    <div className="interaction-playground__toolbar">
      {INTERACTIONS.map(interaction => (
        <button
          key={interaction.id}
          className={`interaction-playground__toolbar-button ${selectedInteraction === interaction.id ? 'active' : ''}`}
          onClick={() => onInteraction(interaction.id)}
          title={interaction.description}
        >
          {interaction.icon}
        </button>
      ))}
    </div>
  )
}
