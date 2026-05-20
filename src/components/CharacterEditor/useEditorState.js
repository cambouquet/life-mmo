import { useState, useCallback } from 'react'
import { parseDateFromString, parseTimeFromString, formatDate, formatTime } from './dateTimeUtils.js'
import { DEFAULT_COLORS } from './editorState.js'

export function useEditorState(initialColors, initialBirthData, initialName) {
  const [activePage, setActivePage] = useState(null)
  const [name, setName] = useState(initialName ?? '')
  const [birthDate, setBirthDate] = useState(() => parseDateFromString(initialBirthData?.date))
  const [birthTime, setBirthTime] = useState(() => parseTimeFromString(initialBirthData?.time))
  const [hasDate, setHasDate] = useState(!!initialBirthData?.date)
  const [birthCity, setBirthCity] = useState(initialBirthData?.city ?? null)
  const [previewDate, setPreviewDate] = useState(null)
  const [previewTime, setPreviewTime] = useState(null)
  const [colors, setColors] = useState(initialColors || DEFAULT_COLORS)
  const [previewColors, setPreviewColors] = useState(null)

  const chartDate = previewDate ?? birthDate
  const chartTime = previewTime ?? birthTime
  const displayColors = previewColors ?? colors
  const trimmedName = name.trim() || null
  const dateStr = formatDate(birthDate)
  const timeStr = formatTime(birthTime)
  const birthDataOutput = hasDate ? { date: dateStr, time: timeStr, city: birthCity } : null

  return {
    activePage, setActivePage,
    name, setName,
    birthDate, setBirthDate,
    birthTime, setBirthTime,
    hasDate, setHasDate,
    birthCity, setBirthCity,
    previewDate, setPreviewDate,
    previewTime, setPreviewTime,
    colors, setColors,
    previewColors, setPreviewColors,
    chartDate, chartTime, displayColors,
    trimmedName, birthDataOutput
  }
}
