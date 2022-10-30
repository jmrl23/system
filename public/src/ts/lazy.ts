/**
 * Lazy load image
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const lazyImages: () => HTMLImageElement[] = () =>
      Array.from(
        document.querySelectorAll<HTMLImageElement>('img.lazy')
      )

    const loadImage = (img: HTMLImageElement) => {
      if (typeof img.dataset.src !== 'string') return
      img.setAttribute('src', img.dataset.src)
      img.removeAttribute('data-src')
      img.classList.remove('lazy')
    }

    if ('IntersectionObserver' in window) {
      const o = function (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) {
        for (const entry of entries) {
          const image = entry.target as HTMLImageElement
          if (typeof image.dataset.src !== 'string') {
            observer.unobserve(image)
            continue
          }
          if (entry.isIntersecting) {
            loadImage(image)
            observer.unobserve(image)
          }
        }
      }
      const intersectionObserver = new IntersectionObserver(
        o as IntersectionObserverCallback
      )
      for (const image of lazyImages()) {
        intersectionObserver.observe(image)
      }
      return
    }

    const isInViewPort = (img: HTMLImageElement) => {
      const rect = img.getBoundingClientRect()
      return (
        rect.top >= -rect.height &&
        rect.left >= -rect.width &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
      )
    }

    const handler = () => {
      const images = lazyImages()
      if (images.length < 1) {
        globalThis.removeEventListener('scroll', handler)
        return
      }
      for (const image of images) {
        if (isInViewPort(image)) loadImage(image)
      }
    }

    for (const image of lazyImages()) {
      if (isInViewPort(image)) loadImage(image)
    }

    addEventListener('scroll', handler)
  })
})()
