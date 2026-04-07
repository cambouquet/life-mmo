import down0Svg from '../../assets/sprites/warrior/down_0.svg?raw'
import down1Svg from '../../assets/sprites/warrior/down_1.svg?raw'
import up0Svg   from '../../assets/sprites/warrior/up_0.svg?raw'
import up1Svg   from '../../assets/sprites/warrior/up_1.svg?raw'
import left0Svg from '../../assets/sprites/warrior/left_0.svg?raw'
import left1Svg from '../../assets/sprites/warrior/left_1.svg?raw'
import right0Svg from '../../assets/sprites/warrior/right_0.svg?raw'
import right1Svg from '../../assets/sprites/warrior/right_1.svg?raw'

function svgDataUri(svgText) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)
}

function makeImg(svgText) {
  const img = new Image()
  img.src = svgDataUri(svgText)
  return img
}

const IMGS = {
  down:  [makeImg(down0Svg),  makeImg(down1Svg)],
  up:    [makeImg(up0Svg),    makeImg(up1Svg)],
  left:  [makeImg(left0Svg),  makeImg(left1Svg)],
  right: [makeImg(right0Svg), makeImg(right1Svg)],
}

export function drawWarriorSprite(ctx, x, y, facing, frame) {
  const fi = frame & 1
  const img = IMGS[facing]?.[fi] ?? IMGS.down[0]
  if (!img.complete) return
  const bob = fi === 1 ? 1 : 0
  ctx.save()
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, Math.floor(x) - 8, Math.floor(y) + bob - 16, 32, 32)
  ctx.restore()
}


