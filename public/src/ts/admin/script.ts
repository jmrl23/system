// import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'
import { pageToggler, makeDepartmentCard } from '/js/helper.js'

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

/**
 * It fetches the departments from the server and returns them as a promise.
 * @returns An array of departments.
 */
async function fetchDepartments() {
  const response = await fetch('/api/departments/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  const departments = await response.json()
  if (response.status >= 400) throw new Error(departments.message)
  return departments
}

// initialization, fetch data from server
;(async () => {
  try {
    const [students, departments] = await Promise.all([
      fetchStudents(),
      fetchDepartments()
    ])
    console.log('Students', students)
    const departmentCards = departments.map(makeDepartmentCard)
    const departmentsContainer = document.querySelector('#card-container')
    departmentsContainer?.append(...departmentCards)
  } catch (error) {
    if (error instanceof Error) {
      alert('An error occurs')
      console.error(error)
    }
  }
})()

const modalBackground = document.querySelector('#modal-background')
const modalContainer = modalBackground?.querySelector('#modal-container')
const modalCloseButtons = modalContainer?.querySelectorAll<HTMLButtonElement>(
  'button[data-action=close-modal]'
)
const createDepartmentCard = document.querySelector('#create-department-card')

/**
 * If the modalContainer exists, add the class 'hidden' to the modalBackground and remove the class
 * 'grid' from the modalBackground, remove the class 'overflow-hidden' from the body, and add the class
 * 'hidden' to each modal in the modalContainer.
 * @returns The modalContainer is being returned.
 */
function closeModal() {
  if (!modalContainer) return
  modalBackground?.classList.add('hidden')
  modalBackground?.classList.remove('grid')
  document.body.classList.remove('overflow-hidden')
  for (const modal of Array.from(modalContainer.children)) {
    modal.classList.add('hidden')
  }
  const inputs = document.querySelectorAll<HTMLInputElement>(
    'input[type=text], input[type=hidden]'
  )
  for (const input of Array.from(inputs)) {
    input.value = ''
  }
}

/**
 * It takes a string as an argument, and if the modalContainer exists, it adds the class 'grid' to the
 * modalBackground, removes the class 'hidden' from the modalBackground, adds the class
 * 'overflow-hidden' to the body, and then loops through the modalContainer's children, adding the
 * class 'hidden' to each one, and then if the modal's dataset.content is equal to the target, it
 * removes the class 'hidden' from the modal.
 * @param {string} target - string - The target modal to open.
 * @returns undefined.
 */
function openModal(target: string) {
  if (!modalContainer) return
  modalBackground?.classList.add('grid')
  modalBackground?.classList.remove('hidden')
  document.body.classList.add('overflow-hidden')
  for (const modal of Array.from(modalContainer.children)) {
    modal.classList.add('hidden')
    const e = modal as HTMLDivElement
    if (e?.dataset?.content === target) {
      e.classList.remove('hidden')
    }
  }
}

modalBackground?.addEventListener('click', function (e) {
  if (e.target === modalBackground || e.target === modalContainer) closeModal()
})

createDepartmentCard?.addEventListener('click', function () {
  openModal('create-department')
})

for (const button of Array.from(modalCloseButtons ?? [])) {
  button.addEventListener('click', closeModal)
}

const createDepartmentForm = modalContainer?.querySelector<HTMLFormElement>(
  '[data-content=create-department]'
)

createDepartmentForm?.addEventListener('submit', async function (e) {
  e.preventDefault()
  const alias = createDepartmentForm
    .querySelector<HTMLInputElement>('input[name=department-alias]')
    ?.value.trim()
  const name = createDepartmentForm
    .querySelector<HTMLInputElement>('input[name=department-name]')
    ?.value.trim()
  const color = createDepartmentForm
    .querySelector<HTMLInputElement>('input[name=department-color]')
    ?.value.trim()
  const response = await fetch('/api/department/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, alias, color })
  })
  const department = await response.json()
  if (response.status >= 400) throw new Error(department.message)
  const departmentsContainer = document.querySelector('#card-container')
  departmentsContainer?.append(makeDepartmentCard(department))
  closeModal()
})

const colorButtons = createDepartmentForm?.querySelectorAll<HTMLButtonElement>(
  '#color-buttons-container button'
)

for (const button of Array.from(colorButtons || [])) {
  button.addEventListener('click', function () {
    const departmentColor =
      createDepartmentForm?.querySelector<HTMLInputElement>(
        'input[name=department-color]'
      )
    if (!departmentColor) return
    departmentColor.value = button.value
  })
}
