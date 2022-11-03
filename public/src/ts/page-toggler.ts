(function () {
  /**
   * usage
   * 
   * <button data-toggle-page="about">
   *   About
   * </button>
   * <button data-toggle-page="example">
   *   Example
   * </button>
   * 
   * <main id="main-container">
   *   <div data-content="about">
   *     About
   *   </div>
   *   <div data-content="axample">
   *     example
   *   </div>
   * </main>
   */
  document.addEventListener('DOMContentLoaded', function () {
    const mainContainer = document.querySelector<HTMLDivElement>('#main-container')
    const pageTogglerButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-toggle-page]'))
    const getPages = () => mainContainer?.querySelectorAll<HTMLDivElement>('[data-content]')
    for (const button of pageTogglerButtons) {
      button.addEventListener('click', function () {
        const pages = getPages()
        const targetPage = button.dataset.togglePage
        if (!pages || typeof targetPage !== 'string') return
        for (const page of Array.from(pages)) {
          page.classList.toggle('hidden', targetPage !== page.dataset.content)
        }
      })
    }
  })
})()