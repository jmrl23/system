;(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const getLazyImages: () => HTMLImageElement[] = () =>
      Array.from(
        document.querySelectorAll<HTMLImageElement>('img[data-lazy-src]')
      )

    const loadImage = (image: HTMLImageElement) => {
      const lazySrc = image.dataset.lazySrc
      if (typeof lazySrc !== 'string') return
      image.removeAttribute('data-lazy-src')
      image.setAttribute('src', lazySrc)
    }

    if ('IntersectionObserver' in window) {
      const intersectionObserver = new IntersectionObserver(
        (entries, observer) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              loadImage(entry.target as HTMLImageElement)
              observer.unobserve(entry.target)
            }
          }
        }
      )
      for (const image of getLazyImages()) {
        intersectionObserver.observe(image)
      }
      return
    }

    try {
      const isInViewPort = (image: HTMLImageElement) => {
        const rect = image.getBoundingClientRect()
        return (
          rect.top >= -rect.height &&
          rect.left >= -rect.width &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) +
              rect.height &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth) +
              rect.width
        )
      }
      const handler = () => {
        for (const image of getLazyImages()) {
          if (isInViewPort(image)) loadImage(image)
        }
        if (getLazyImages().length < 1) {
          clearInterval(listener)
        }
      }
      const listener = setInterval(handler, 10)
      return
    } catch (error) {
      /** Do nothing */
    }

    for (const image of getLazyImages()) {
      loadImage(image)
      image.setAttribute('loading', 'lazy')
    }
  })
})()
