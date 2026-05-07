import { test, expect } from '@playwright/test'

const sizes = [500, 400, 350, 300]

sizes.forEach(width => {
  test(`should have no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 })
    await page.goto('http://localhost:5173')
    await page.waitForLoadState('networkidle')

    const measurements = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
      }
    })

    console.log(`${width}px:`, JSON.stringify(measurements))
    expect(measurements.hasScroll).toBe(false)
  })
})
