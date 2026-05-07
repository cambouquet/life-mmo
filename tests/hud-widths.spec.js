import { test } from '@playwright/test'

test('check HUD component widths', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 600 })
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')

  const hudWidths = await page.evaluate(() => {
    const hud = document.querySelector('.hud')
    const children = hud.children
    const widths = {}

    Array.from(children).forEach(child => {
      const rect = child.getBoundingClientRect()
      const name = child.className || child.tagName
      widths[name] = {
        width: Math.round(rect.width),
        flex: window.getComputedStyle(child).flex
      }
    })

    widths.viewport = window.innerWidth
    widths.hudWidth = Math.round(hud.getBoundingClientRect().width)

    return widths
  })

  console.log('HUD Widths:', JSON.stringify(hudWidths, null, 2))
})
