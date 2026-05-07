import { test, expect } from '@playwright/test'

test.describe('Layout - Debug visibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 600 })
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')
  })

  test('check if record button is actually rendered', async ({ page }) => {
    const recordWrap = await page.locator('.record-wrap-with-tools')
    const visible = await recordWrap.isVisible()
    const count = await recordWrap.count()
    const box = await recordWrap.boundingBox()

    console.log('Record wrap count:', count)
    console.log('Record wrap visible:', visible)
    console.log('Record wrap box:', box)
    console.log('Display:', await recordWrap.evaluate(el => window.getComputedStyle(el).display))
    console.log('Visibility:', await recordWrap.evaluate(el => window.getComputedStyle(el).visibility))
    console.log('Opacity:', await recordWrap.evaluate(el => window.getComputedStyle(el).opacity))
  })

  test('check if menu bar is actually rendered', async ({ page }) => {
    const menuBar = await page.locator('.menu-bar')
    const visible = await menuBar.isVisible()
    const count = await menuBar.count()
    const box = await menuBar.boundingBox()

    console.log('Menu bar count:', count)
    console.log('Menu bar visible:', visible)
    console.log('Menu bar box:', box)
    console.log('Display:', await menuBar.evaluate(el => window.getComputedStyle(el).display))
    console.log('Visibility:', await menuBar.evaluate(el => window.getComputedStyle(el).visibility))
    console.log('Opacity:', await menuBar.evaluate(el => window.getComputedStyle(el).opacity))
  })
})
