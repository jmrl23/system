import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'
import { pageToggler } from '/js/helper.js'

const sidebarButtons = document.querySelectorAll<HTMLButtonElement>(
  '.side-bar-container button[data-target]'
)

pageToggler(
  sidebarButtons,
  document.querySelector<HTMLDivElement>('#main-container'),
  function (button: HTMLButtonElement) {
    const pageTitle = document.querySelector<HTMLHeadingElement>('#page-title')
    if (pageTitle?.textContent)
      pageTitle.textContent = button.dataset.target as string
    for (const _button of Array.from(sidebarButtons)) {
      _button.classList.remove('active')
      if (button === _button) button.classList.add('active')
    }
  }
)

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

addEventListener('click', function (e) {
  const element = e.target as HTMLDivElement
  if (!['modal', 'edit', 'delete'].includes(element.id))
    modal?.classList.add('hidden')
  e.stopPropagation()
})

/**
 * It fetches a list of students from the server
 * @param {string} [keyword] - string | undefined
 * @param [skip=0] - the number of records to skip
 * @param [take=15] - number of items to take
 * @returns An object with a property called students.
 */
async function fetchStudents(keyword?: string, skip = 0, take = 15) {
  const response = await fetch('/api/users/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      role: 'STUDENT',
      keyword,
      skip,
      take
    })
  })
  const students = await response.json()
  if (response.status >= 400) throw new Error(students.message)
  return students
}

/* An IIFE (Immediately Invoked Function Expression) */
;(async () => {
  // test
  try {
    const students = await fetchStudents(undefined, 0, 10)
    console.log('Students:', students)
  } catch (error) {
    if (error instanceof Error) alert(error.message)
  }
})()
