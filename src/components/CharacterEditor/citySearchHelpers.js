export function formatCoordinate(value, positive, negative) {
  if (value > 0) return value.toFixed(2) + positive
  return Math.abs(value).toFixed(2) + negative
}

export function formatCityCoords(city, short = false) {
  const latStr = city.lat > 0 ? city.lat.toFixed(short ? 1 : 2) + '°N' : Math.abs(city.lat).toFixed(short ? 1 : 2) + '°S'
  const lngStr = city.lng > 0 ? city.lng.toFixed(2) + '°E' : Math.abs(city.lng).toFixed(2) + '°W'
  const tzStr = ' · UTC' + (city.tz >= 0 ? '+' : '') + city.tz
  return short ? latStr + ' · ' + lngStr : latStr + ' · ' + lngStr + tzStr
}

export function useCitySearchOutsideClick(wrapRef, setOpen) {
  const handleClick = (e) => {
    if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
  }
  return handleClick
}
