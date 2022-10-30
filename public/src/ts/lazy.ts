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
    for (const image of lazyImages()) {
      loadImage(image)
      image.setAttribute('loading', 'lazy')
    }
  })
})()