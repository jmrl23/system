import { pageToggler } from './helper.js'

const sidenavButtons =
  document.querySelectorAll<HTMLButtonElement>('.sidenav button')

pageToggler(
  sidenavButtons,
  document.querySelector('#contents'),
  function (button: HTMLButtonElement) {
    const currentPageIndicator =
      document.querySelector<HTMLHeadingElement>('#current-page')
    if (!currentPageIndicator?.textContent) return
    currentPageIndicator.textContent = button.textContent
    for (const _button of Array.from(sidenavButtons)) {
      _button.classList.toggle('active', _button === button)
    }
  }
)
