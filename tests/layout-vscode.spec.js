import { test, expect } from '@playwright/test'

test.describe('Layout - VS Code preview (600px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 600 })
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('record button should be visible within viewport', async ({ page }) => {
    const recordWrap = await page.locator('.record-wrap-with-tools')
    const box = await recordWrap.boundingBox()
    const viewport = page.viewportSize()

    console.log('Record wrap box:', box)
    console.log('Viewport:', viewport)
    console.log('Overflowing:', box.x + box.width > viewport.width)

    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
  })

  test('menu bar should be visible within viewport', async ({ page }) => {
    const menuBar = await page.locator('.menu-bar')
    const box = await menuBar.boundingBox()
    const viewport = page.viewportSize()

    console.log('Menu bar box:', box)
    console.log('Viewport:', viewport)
    console.log('Overflowing:', box.x + box.width > viewport.width)

    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
  })
})
