const pageTitle = document.querySelector<HTMLHeadingElement>('#page-title')
const sidebarButtons = document.querySelectorAll<HTMLButtonElement>(
  'button[data-toggle-page]'
)

for (const button of Array.from(sidebarButtons)) {
  button.addEventListener('click', function () {
    for (const _button of Array.from(sidebarButtons)) {
      _button.classList.remove(
        'text-green-500',
        'bg-green-100',
        'hover:bg-green-200'
      )
      _button.classList.add('bg-gray-200', 'hover:bg-gray-300')
    }
    if (pageTitle?.textContent) {
      pageTitle.textContent = button.dataset.togglePage as string
      button.classList.add(
        'text-green-500',
        'bg-green-100',
        'hover:bg-green-200'
      )
      button.classList.remove('bg-gray-200', 'hover:bg-gray-300')
    }
  })
}
