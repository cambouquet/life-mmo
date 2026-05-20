import { HOUSE_THEMES, HOUSE_LONG } from './houseWheelData.js'

export function createHouseSliceHandlers(h, housePlanets, setHovered) {
  const handleEnter = () => {
    setHovered({
      type: 'house',
      id: h,
      label: `House ${h}`,
      theme: HOUSE_THEMES[h],
      desc: HOUSE_LONG[h],
      planets: housePlanets,
    })
  }

  const handleLeave = () => {
    setHovered(null)
  }

  return { handleEnter, handleLeave }
}
