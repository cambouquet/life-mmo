import React from 'react'
import { MonthPicker } from './MonthPicker.jsx'
import { DayPicker } from './DayPicker.jsx'
import { YearRing } from './YearRing.jsx'

export function DatePicker({ birthDate, onBirthDateChange, polarToXY, arc }) {
  if (!birthDate || !onBirthDateChange) return null

  return (
    <>
      <MonthPicker birthDate={birthDate} onBirthDateChange={onBirthDateChange} polarToXY={polarToXY} arc={arc} />
      <DayPicker birthDate={birthDate} onBirthDateChange={onBirthDateChange} polarToXY={polarToXY} arc={arc} />
      <YearRing birthDate={birthDate} polarToXY={polarToXY} arc={arc} />
    </>
  )
}
