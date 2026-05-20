export const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const DAYS_IN_MONTH = (m, y) => new Date(y, m, 0).getDate()
export const YEARS = Array.from({length: 101}, (_, i) => 1930 + i)

export function createDateRings(value, month, year, onChange) {
  const maxDay = DAYS_IN_MONTH(month, year)
  return [
    {
      count: maxDay,
      r1: 28, r2: 50,
      isSelected: () => false,
      shouldShowLabel: (i) => i % 5 === 0,
      label: (i) => String(i + 1),
      onHover: (v, i) => ({ day: i + 1, month: v.month, year: v.year }),
      onSelect: (v, i) => { onChange({ day: i + 1, month: v.month, year: v.year }); return v }
    },
    {
      count: 12,
      r1: 54, r2: 76,
      isSelected: (v, i) => i + 1 === v.month,
      shouldShowLabel: () => true,
      label: (i) => MONTHS_SHORT[i],
      onHover: (v, i) => {
        const nm = i + 1
        return { day: Math.min(v.day, DAYS_IN_MONTH(nm, v.year)), month: nm, year: v.year }
      },
      onSelect: (v, i) => {
        const nm = i + 1
        onChange({ day: Math.min(v.day, DAYS_IN_MONTH(nm, v.year)), month: nm, year: v.year })
        return v
      }
    },
    {
      count: YEARS.length,
      r1: 80, r2: 102,
      isSelected: (v, i) => YEARS[i] === v.year,
      shouldShowLabel: (i) => {
        const yearIdx = YEARS.indexOf(value.year)
        return i === yearIdx || Math.abs(i - yearIdx) <= 2 || Math.abs(i - yearIdx) >= YEARS.length - 2
      },
      label: (i) => String(YEARS[i]),
      onHover: (v, i) => ({ day: v.day, month: v.month, year: YEARS[i] }),
      onSelect: (v, i) => { onChange({ day: v.day, month: v.month, year: YEARS[i] }); return v }
    }
  ]
}

export const needleConfig = {
  needleR1: 101,
  needleR2: 113,
  degreesToUnits: 365 / 360
}

export const centerDisplay = {
  lines: [
    {
      offset: -7,
      size: 13,
      weight: 700,
      color: '#e8d4ff',
      text: (v) => `${String(v.day).padStart(2,'0')} ${MONTHS_SHORT[v.month-1]}`
    },
    {
      offset: 9,
      size: 11,
      weight: 500,
      color: 'rgba(200,168,240,0.7)',
      text: (v) => String(v.year)
    }
  ]
}
