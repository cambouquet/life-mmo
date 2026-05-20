const DEMO_NAMES = ['Lyra', 'Oryn', 'Sael', 'Vex', 'Nira', 'Caen', 'Thea', 'Rook']

export function randomName() {
  return DEMO_NAMES[Math.floor(Math.random() * DEMO_NAMES.length)]
}
