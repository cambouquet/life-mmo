export const ROMAN_NUMERALS = {
  0:  'XII',
  3:  'III',
  6:  'VI',
  9:  'IX'
}

export function getSeasonData(overrideDay) {
  const now = new Date()
  const year = now.getFullYear()
  const dayOfYear = overrideDay !== undefined ? overrideDay : Math.floor((now - new Date(year, 0, 0)) / 86400000)

  const summerSolstice = 172
  const winterSolstice = 355

  let lightProgress
  if (dayOfYear <= summerSolstice) {
    const totalDays = summerSolstice + (365 - winterSolstice)
    const daysSinceWinter = dayOfYear + (365 - winterSolstice)
    lightProgress = daysSinceWinter / totalDays
  } else if (dayOfYear <= winterSolstice) {
    const totalDays = winterSolstice - summerSolstice
    const daysSinceSummer = dayOfYear - summerSolstice
    lightProgress = 1 - (daysSinceSummer / totalDays)
  } else {
    const totalDays = summerSolstice + (365 - winterSolstice)
    const daysSinceWinter = dayOfYear - winterSolstice
    lightProgress = daysSinceWinter / totalDays
  }

  const yearProgress = dayOfYear / 365

  const date = new Date(year, 0)
  date.setDate(dayOfYear + 1)
  const dateString = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return {
    light: Math.max(0, Math.min(1, lightProgress)),
    year:  yearProgress,
    isRising: dayOfYear > winterSolstice || dayOfYear < summerSolstice,
    day: dayOfYear,
    dateString
  }
}
