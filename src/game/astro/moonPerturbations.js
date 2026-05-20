export const MOON_PERTURBATIONS = [
  { factor: -1.274, angle: (M, D) => M - 2*D },
  { factor:  0.658, angle: (M, D) => 2*D },
  { factor: -0.186, angle: (M, D, Ms) => Ms },
  { factor: -0.059, angle: (M, D) => 2*M - 2*D },
  { factor: -0.057, angle: (M, D, Ms) => M - 2*D + Ms },
  { factor:  0.053, angle: (M, D) => M + 2*D },
  { factor:  0.046, angle: (M, D, Ms) => 2*D - Ms },
  { factor:  0.041, angle: (M, D, Ms) => M - Ms },
  { factor: -0.035, angle: (M, D) => D },
  { factor: -0.031, angle: (M, D, Ms) => M + Ms },
  { factor: -0.015, angle: (M, D, F) => 2*D - 2*F },
  { factor:  0.011, angle: (M, D, Ms) => 2*D - M + Ms },
]

export function applyMoonPerturbations(lon, M, D, F, Ms) {
  let result = lon
  for (const p of MOON_PERTURBATIONS) {
    const arg = p.angle(M, D, F, Ms)
    const coeff = Math.sin(arg * Math.PI / 180)
    result += p.factor * coeff
  }
  return result
}
