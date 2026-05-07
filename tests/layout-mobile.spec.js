import { test, expect } from '@playwright/test'

test.describe('Layout - Mobile (375px)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('record button should be visible and not overflow', async ({ page }) => {
    const recordWrap = await page.locator('.record-wrap-with-tools')
    const box = await recordWrap.boundingBox()
    const viewport = page.viewportSize()

    console.log('Record wrap box:', box)
    console.log('Viewport:', viewport)
    
    expect(box).toBeTruthy()
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    expect(box.x).toBeGreaterThanOrEqual(0)
  })

  test('menu bar should be visible and not overflow', async ({ page }) => {
    const menuBar = await page.locator('.menu-bar')
    const box = await menuBar.boundingBox()
    const viewport = page.viewportSize()

    console.log('Menu bar box:', box)
    console.log('Viewport:', viewport)
    
    expect(box).toBeTruthy()
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    expect(box.x).toBeGreaterThanOrEqual(0)
  })

  test('no horizontal scroll', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

    console.log('Scroll width:', scrollWidth)
    console.log('Client width:', clientWidth)

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })
})
