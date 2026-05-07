import { test, expect } from '@playwright/test'

test('sprite picker should not cause horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 718, height: 667 })
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')

  // Get initial scroll state
  const initialScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
  const initialClientWidth = await page.evaluate(() => document.documentElement.clientWidth)

  console.log('Initial state:')
  console.log('  scrollWidth:', initialScrollWidth)
  console.log('  clientWidth:', initialClientWidth)
  console.log('  hasScroll:', initialScrollWidth > initialClientWidth)

  // Check sprite picker overflow
  const spritePickerInfo = await page.evaluate(() => {
    const picker = document.querySelector('.sprite-picker-overlay')
    if (!picker) return null

    const rect = picker.getBoundingClientRect()
    return {
      exists: true,
      right: Math.round(rect.right),
      width: Math.round(rect.width),
      viewport: window.innerWidth,
      overflow: Math.round(rect.right - window.innerWidth)
    }
  })

  console.log('Sprite picker:')
  console.log(JSON.stringify(spritePickerInfo, null, 2))

  // Assert no horizontal scroll
  expect(initialScrollWidth).toBeLessThanOrEqual(initialClientWidth + 1)

  // Assert sprite picker doesn't overflow
  if (spritePickerInfo) {
    expect(spritePickerInfo.right).toBeLessThanOrEqual(spritePickerInfo.viewport + 1)
  }
})
