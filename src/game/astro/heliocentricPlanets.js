import { heliocentricPosition, sunGeocentricCoordinates, toGeocentricLongitude } from './ephemerisCore.js'

export function mercuryLongitude(d) {
  const w_offset = 2.439
  const { x, y } = heliocentricPosition(d,
    48.3313,  3.24587e-5,
     7.0047,  5.00e-8,
    29.1241 + w_offset,  1.01444e-5,
     0.387098,
     0.205635,  5.59e-10,
   168.6562,  4.0923344368
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function venusLongitude(d) {
  const w_offset = 2.3562
  const { x, y } = heliocentricPosition(d,
    76.6799,  2.46590e-5,
     3.3946,  2.75e-8,
    54.8910 + w_offset,  1.38374e-5,
     0.723330,
     0.006773, -1.302e-9,
    48.0052,  1.6021302244
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function marsLongitude(d) {
  const w_offset = 0.77747
  const { x, y } = heliocentricPosition(d,
    49.5574,  2.11081e-5,
     1.8497, -1.78e-8,
   286.5016 + w_offset,  2.92961e-5,
     1.523688,
     0.093405,  2.516e-9,
    18.6021,  0.5240207766
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function jupiterLongitude(d) {
  const w_offset = 0.0443
  const { x, y } = heliocentricPosition(d,
   100.4542,  2.76854e-5,
     1.3030, -1.557e-7,
   273.8777 + w_offset,  1.64505e-5,
     5.20256,
     0.048498,  4.469e-9,
    19.8950,  0.0830853001
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function saturnLongitude(d) {
  const w_offset = -0.11062
  const { x, y } = heliocentricPosition(d,
   113.6634,  2.38980e-5,
     2.4886, -1.081e-7,
   339.3939 + w_offset,  2.97661e-5,
     9.55475,
     0.055546, -9.499e-9,
   316.9670,  0.0334442282
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function uranusLongitude(d) {
  const { x, y } = heliocentricPosition(d,
    74.0005,  1.3978e-5,
     0.7733,  1.9e-8,
    96.6612,  3.0565e-5,
    19.18171,
     0.047318,  7.45e-9,
   142.5905,  0.011725806
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}

export function neptuneLongitude(d) {
  const { x, y } = heliocentricPosition(d,
   131.7806,  3.0173e-5,
     1.7700, -2.55e-7,
   272.8461, -6.027e-6,
    30.05826,
     0.008606,  2.15e-9,
   260.2471,  0.005995147
  )
  const { xs, ys } = sunGeocentricCoordinates(d)
  return toGeocentricLongitude(x, y, xs, ys)
}
