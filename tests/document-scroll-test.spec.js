import { test, expect } from '@playwright/test'

test('document should have no horizontal scroll at 718px', async ({ page }) => {
  await page.setViewportSize({ width: 718, height: 667 })
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')

  // Measure document dimensions
  const measurements = await page.evaluate(() => {
    const html = document.documentElement
    const body = document.body

    return {
      html: {
        scrollWidth: html.scrollWidth,
        clientWidth: html.clientWidth,
        offsetWidth: html.offsetWidth
      },
      body: {
        scrollWidth: body.scrollWidth,
        clientWidth: body.clientWidth,
        offsetWidth: body.offsetWidth
      },
      window: {
        innerWidth: window.innerWidth,
        outerWidth: window.outerWidth
      }
    }
  })

  console.log('Document measurements:')
  console.log(JSON.stringify(measurements, null, 2))

  // Assert: document should not be wider than viewport
  const hasHorizontalScroll = measurements.html.scrollWidth > measurements.html.clientWidth

  console.log('\nHas horizontal scroll:', hasHorizontalScroll)
  console.log('Excess width:', measurements.html.scrollWidth - measurements.html.clientWidth, 'px')

  expect(hasHorizontalScroll).toBe(false)
})
