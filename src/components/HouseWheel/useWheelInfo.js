import { useState, useEffect } from 'react'

export function useWheelInfo(setHoverInfo, lockedPoint, hovered, placements, allData) {
  useEffect(() => {
    if (!setHoverInfo) return
    setHoverInfo(allData)
  }, [lockedPoint, hovered, setHoverInfo, allData])

  return { hoverInfo: allData }
}
