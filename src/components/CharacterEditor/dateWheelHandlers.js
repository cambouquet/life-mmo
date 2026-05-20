import { MONTHS_SHORT, YEARS, DAYS_IN_MONTH } from './dateWheelConfig.js'

export function createDateWheelNeedleHandler(onChange) {
  return {
    onDelta: (v, steps) => {
      const d = new Date(v.year, v.month - 1, v.day)
      d.setDate(d.getDate() + steps)
      const minDate = new Date(1930, 0, 1)
      const maxDate = new Date(2030, 11, 31)
      if (d < minDate || d > maxDate) return v
      onChange({ day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() })
      return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() }
    }
  }
}
