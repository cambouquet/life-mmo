import { useCallback } from 'react'

export function useBirthDateHandlers(birthDate, setBirthDate, setHasDate, setPreviewDate, setPreviewTime, setBirthTime) {
  const handleBirthDateChange = useCallback(
    v => {
      setBirthDate(v)
      setHasDate(true)
      setPreviewDate(null)
    },
    [setBirthDate, setHasDate, setPreviewDate]
  )

  const handleBirthTimeChange = useCallback(
    v => {
      if (v.daysDiff) {
        const d = new Date(birthDate.year, birthDate.month - 1, birthDate.day)
        d.setDate(d.getDate() + v.daysDiff)
        setBirthDate({ day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() })
      }
      setBirthTime({ hour: v.hour, minute: v.minute })
      setPreviewTime(null)
    },
    [birthDate, setBirthDate, setBirthTime, setPreviewTime]
  )

  return { handleBirthDateChange, handleBirthTimeChange }
}
