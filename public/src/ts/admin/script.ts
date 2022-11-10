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
