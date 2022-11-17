import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'

const pageTitle = document.querySelector<HTMLHeadingElement>('#page-title')
const sidebarButtons = document.querySelectorAll<HTMLButtonElement>(
  'button[data-toggle-page]'
)

for (const button of Array.from(sidebarButtons)) {
  button.addEventListener('click', function () {
    for (const _button of Array.from(sidebarButtons)) {
      _button.classList.remove('active')
    }
    if (pageTitle?.textContent) {
      pageTitle.textContent = button.dataset.togglePage as string
      button.classList.add('active')
    }
  })
}

const modal = document.getElementById('modal')
const menuButtons = document.querySelectorAll('button.kebab')

menuButtons.forEach((button) => {
  button.addEventListener('click', (e) => {
    modal?.classList.remove('hidden')
    if (modal) {
      createPopper(button, modal, {
        placement: 'left-start'
      })
      e.stopPropagation()
    }
  })
})

window.addEventListener('click', (e) => {
  const element = e.target as HTMLDivElement
  if (
    element.id !== 'modal' &&
    element.id !== 'edit' &&
    element.id !== 'delete'
  ) {
    modal?.classList.add('hidden')
  }
  e.stopPropagation()
})
