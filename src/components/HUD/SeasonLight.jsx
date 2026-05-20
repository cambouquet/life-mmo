export function SeasonLight({ season }) {
  return (
    <>
      <circle
        cx="40"
        cy="40"
        r="8"
        fill="gold"
        style={{ filter: `drop-shadow(0 0 ${20 * season.light}px gold) brightness(1.2)` }}
      />
      <circle cx="40" cy="40" r="8" fill="white" fillOpacity="0.1" />
      <rect
        x="39"
        y={15 + (1 - season.light) * 50}
        width="2"
        height={season.light * 50}
        fill="gold"
        fillOpacity="0.75"
        style={{ transition: 'all 0.1s linear' }}
      />
    </>
  )
}
