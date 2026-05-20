export function SeasonOrbit({ season }) {
  return (
    <>
      <circle cx="40" cy="40" r="25" className="season-track" />
      <circle
        cx={40 + 25 * Math.cos(season.year * Math.PI * 2 + Math.PI / 2)}
        cy={40 + 25 * Math.sin(season.year * Math.PI * 2 + Math.PI / 2)}
        r={5}
        className="season-earth"
        style={{
          fill: '#4a9eff',
          filter: 'drop-shadow(0 0 6px rgba(74, 158, 255, 0.8))',
          stroke: 'white',
          strokeWidth: 1
        }}
      />
    </>
  )
}
