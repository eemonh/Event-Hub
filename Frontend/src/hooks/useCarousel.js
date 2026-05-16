import { useCallback, useEffect, useState } from "react"

export default function useCarousel({ items, containerRef, itemRefs, initialIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex)

  const updateActiveItem = useCallback(() => {
    const container = containerRef.current
    if (!container || !itemRefs.current) return

    const containerRect = container.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let closestIndex = 0
    let closestDistance = Infinity

    for (let i = 0; i < items.length; i++) {
      const item = itemRefs.current[i]
      if (!item) continue

      const itemRect = item.getBoundingClientRect()
      const itemCenter = itemRect.left + itemRect.width / 2
      const distance = Math.abs(containerCenter - itemCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    }

    setActiveIndex((current) =>
      current === closestIndex ? current : closestIndex
    )
  }, [containerRef, itemRefs, items.length])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationId = null

    const handleScroll = () => {
      if (animationId) return
      animationId = requestAnimationFrame(() => {
        animationId = null
        updateActiveItem()
      })
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    updateActiveItem()

    return () => {
      container.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [containerRef, updateActiveItem])

  const scrollTo = useCallback((index) => {
    setActiveIndex(index)
    itemRefs.current[index]?.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "smooth",
    })
  }, [itemRefs])

  return { activeIndex, scrollTo }
}
