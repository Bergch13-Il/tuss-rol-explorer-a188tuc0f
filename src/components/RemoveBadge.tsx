import { useEffect } from 'react'

export function RemoveBadge() {
  useEffect(() => {
    const removeSkipBadge = () => {
      // Target by image source (skip.png is present in public folder and used in badge)
      const images = document.querySelectorAll(
        'img[src*="skip.png"], img[src*="skip.svg"]',
      )
      images.forEach((img) => {
        // The badge is usually an anchor tag wrapping the image, or a fixed div
        // We look for the closest anchor or a fixed container
        const container =
          img.closest('a') || img.closest('div[style*="fixed"]') || img
        container.remove()
      })

      // Target by common Skip links
      const links = document.querySelectorAll(
        'a[href*="skip.new"], a[href*="goskip.app"]',
      )
      links.forEach((link) => link.remove())

      // Target by aria-label if present (for accessibility elements)
      const ariaElements = document.querySelectorAll(
        '[aria-label*="Criado com o Skip"], [aria-label*="Created with Skip"]',
      )
      ariaElements.forEach((el) => el.remove())
    }

    // Execute immediately to catch any existing badge
    removeSkipBadge()

    // Observe changes in the DOM to prevent re-insertion by external scripts
    const observer = new MutationObserver(() => {
      removeSkipBadge()
    })

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true })
    }

    return () => observer.disconnect()
  }, [])

  return null
}
