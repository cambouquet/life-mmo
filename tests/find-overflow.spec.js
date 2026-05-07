import { test } from '@playwright/test'

test('find what is causing horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 600, height: 600 })
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')

  const overflowingElements = await page.evaluate(() => {
    const elements = document.querySelectorAll('*')
    const viewport = window.innerWidth
    const overflowing = []

    elements.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.right > viewport && rect.width > 0) {
        overflowing.push({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          width: rect.width,
          right: rect.right,
          scrollWidth: el.scrollWidth
        })
      }
    })

    return overflowing.slice(0, 20) // Return first 20
  })

  console.log('Overflowing elements:', JSON.stringify(overflowingElements, null, 2))
})
