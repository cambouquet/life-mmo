import { drawEditorBackdrop } from './uiBackdrop'
import { drawCharacterPreview } from './uiCharacter'
import { drawColorPicker } from './uiColorPicker'

export function drawEditorOverlay(ctx, colors, birthData) {
  ctx.save()
  drawEditorBackdrop(ctx)
  drawCharacterPreview(ctx, colors, birthData)
  drawColorPicker(ctx, colors)
  ctx.restore()
}
