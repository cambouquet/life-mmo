import { test, expect } from '@playwright/test'

test.describe('Layout - Right side elements visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('record button should be visible within viewport', async ({ page }) => {
    const recordWrap = await page.locator('.record-wrap-with-tools')

    // Check if element exists
    await expect(recordWrap).toBeVisible()

    // Get bounding box
    const box = await recordWrap.boundingBox()
    const viewport = page.viewportSize()

    console.log('Record wrap box:', box)
    console.log('Viewport:', viewport)

    // Check if it's within viewport
    expect(box).toBeTruthy()
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.x + box.width).toBeGreaterThan(0)
  })

  test('menu bar should be visible within viewport', async ({ page }) => {
    const menuBar = await page.locator('.menu-bar')

    // Check if element exists
    await expect(menuBar).toBeVisible()

    // Get bounding box
    const box = await menuBar.boundingBox()
    const viewport = page.viewportSize()

    console.log('Menu bar box:', box)
    console.log('Viewport:', viewport)

    // Check if it's within viewport
    expect(box).toBeTruthy()
    expect(box.x + box.width).toBeLessThanOrEqual(viewport.width)
    expect(box.x).toBeGreaterThanOrEqual(0)
  })

  test('no horizontal scroll should be present', async ({ page }) => {
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)

    console.log('Scroll width:', scrollWidth)
    console.log('Client width:', clientWidth)

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })

  test('HUD should fit within viewport width', async ({ page }) => {
    const hud = await page.locator('.hud')
    const box = await hud.boundingBox()
    const viewport = page.viewportSize()

    console.log('HUD box:', box)
    console.log('Viewport:', viewport)

    expect(box.width).toBeLessThanOrEqual(viewport.width)
  })

  test('game-wrap should not exceed viewport', async ({ page }) => {
    const gameWrap = await page.locator('.game-wrap')
    const box = await gameWrap.boundingBox()
    const viewport = page.viewportSize()

    console.log('Game wrap box:', box)
    console.log('Viewport:', viewport)

    expect(box.width).toBeLessThanOrEqual(viewport.width + 1) // +1 for rounding
  })
})
