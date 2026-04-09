// Remove baked-in shadow ellipses from sprite sheets.
// Reads from backup/ folder, writes to sprites/ folder.
const { Jimp, intToRGBA, rgbaToInt } = require('jimp')
const path = require('path')

const FRAME_W = 32, FRAME_H = 32
const spritesDir = path.resolve(__dirname, '../src/assets/sprites')
const backupDir  = path.join(spritesDir, 'backup')

// MAGICIENNE: shadow pixels are exactly mid-gray (53,53,53).
// Character outlines are pure black (0,0,0) — never touched.
// No character color uses any mid-gray, so it's safe to remove all of them.
async function fixMagicienne() {
  const img = await Jimp.read(path.join(backupDir, '03000_magicienne.png'))
  let removed = 0
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]
    const a = this.bitmap.data[idx + 3]
    if (a === 0) return
    // Shadow gray: r==g==b in range 30–70 (specifically 53,53,53 in this sheet)
    if (r === g && g === b && r >= 30 && r <= 70) {
      this.bitmap.data[idx + 3] = 0
      removed++
    }
  })
  await img.write(path.join(spritesDir, '03000_magicienne.png'))
  console.log(`03000_magicienne.png: removed ${removed} shadow pixels`)
}

// ELFEF: shadow/background pixels are exactly teal (66,140,115).
// No character color uses teal, so safe to remove all matching pixels.
async function fixElfeF() {
  const img = await Jimp.read(path.join(backupDir, '03002_elfeF.png'))
  let removed = 0
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]
    const a = this.bitmap.data[idx + 3]
    if (a === 0) return
    // Teal shadow color (66,140,115) ± small tolerance
    if (Math.abs(r - 66) <= 10 && Math.abs(g - 140) <= 10 && Math.abs(b - 115) <= 10) {
      this.bitmap.data[idx + 3] = 0
      removed++
    }
  })
  await img.write(path.join(spritesDir, '03002_elfeF.png'))
  console.log(`03002_elfeF.png: removed ${removed} shadow pixels`)
}

async function main() {
  await fixMagicienne()
  await fixElfeF()
  console.log('Done.')
}
main().catch(console.error)
