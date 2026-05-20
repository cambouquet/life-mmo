export function getDegreeInterpretation(degrees) {
  const deg = Math.floor(degrees)
  if (deg <= 3) return "Early degrees — this energy is fresh, unformed, and still finding its footing. Raw potential."
  if (deg <= 9) return "First decan — this energy expresses in its purest, most archetypal form."
  if (deg <= 19) return "Second decan — this energy has matured into complexity and nuance."
  if (deg <= 26) return "Third decan — this energy is seasoned, carrying experience and depth."
  return "Late degrees — this energy is at a threshold, carrying the weight of the sign and approaching a transition."
}
