import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'
import { makeSwitch, pageToggler } from './helper.js'
import type { Department } from '@prisma/client'

// initialize
;(async function () {
  const response = await fetch('/api/departments/get', { method: 'POST' })
  const departments = await response.json()
  const departmentCards = departments.map(generateDepartmentCard)
  const departmentsContainer = document.querySelector('#departments-container')
  departmentsContainer?.append(...departmentCards)
})()

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

const modalContainer = document.querySelector('#modal-container')
const modal = modalContainer?.querySelector('#modal')
const modalCloseButtons = document.querySelectorAll('[data-action=close-modal]')

for (const button of Array.from(modalCloseButtons)) {
  button.addEventListener('click', hideModal)
}

modalContainer?.addEventListener('click', function (e) {
  if (e.target === modalContainer || e.target === modal) hideModal()
})

function hideModal() {
  modalContainer?.classList.remove('grid')
  modalContainer?.classList.add('hidden')
  const inputs = modal?.querySelectorAll<HTMLInputElement>(
    'input[type=text], input[type=hidden]'
  )
  for (const input of Array.from(inputs || [])) {
    input.value = ''
  }
  const departmentColors = modal?.querySelectorAll<HTMLInputElement>(
    '#create-department-modal input[name=department-color]'
  )
  for (const departmentColor of Array.from(departmentColors || [])) {
    departmentColor.checked = false
  }
  if (departmentColors) departmentColors[0].checked = true
  document.body.classList.remove('overflow-hidden')
}

const deleteDepartmentModal = document.querySelector<HTMLFormElement>(
  '#delete-department-modal'
)

deleteDepartmentModal?.addEventListener('click', async function (e) {
  e.preventDefault()
  try {
    const id = deleteDepartmentModal['target-id'].value
    const response = await fetch('/api/department/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const { message, error } = await response.json()
    if (error) throw new Error(message)
    const cardsContainer = document.querySelector(
      `#departments-container`
    )?.children
    for (const card of Array.from(cardsContainer || [])) {
      const current = card as HTMLDivElement
      if (current.dataset.referenceId === id) {
        current.remove()
        break
      }
    }
    hideModal()
  } catch (error) {
    if (error instanceof Error) alert(error.message)
  }
})

const editDepartmentModal = document.querySelector<HTMLFormElement>(
  '#edit-department-modal'
)

editDepartmentModal?.addEventListener('submit', async function (e) {
  e.preventDefault()
  try {
    const id = editDepartmentModal['target-id'].value
    const name = editDepartmentModal['department-name'].value.trim()
    const alias = editDepartmentModal['department-alias'].value
      .trim()
      .toUpperCase()
    const color = editDepartmentModal['department-color'].value.trim()
    const response = await fetch('/api/department/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, alias, color })
    })
    const department = await response.json()
    if (response.status > 399) throw new Error(department.message)
    const cardsContainer = document.querySelector(
      `#departments-container`
    )?.children
    for (const card of Array.from(cardsContainer || [])) {
      const current = card as HTMLDivElement
      if (current.dataset.referenceId === id) {
        current.remove()
        const card = generateDepartmentCard(department)
        createDepartmentButton?.insertAdjacentElement('afterend', card)
        break
      }
    }
    hideModal()
  } catch (error) {
    if (error instanceof Error) alert(error.message)
  }
})

function toggleModal(target: string) {
  modalContainer?.classList.add('grid')
  modalContainer?.classList.remove('hidden')
  for (const modalContent of Array.from(modal?.children || [])) {
    const content = modalContent as HTMLDivElement
    content.classList.toggle('hidden', content.dataset.content !== target)
  }
  document.body.classList.add('overflow-hidden')
}

const createDepartmentButton = document.querySelector(
  '#create-department-button'
)

createDepartmentButton?.addEventListener('click', function () {
  toggleModal('create-department')
})

const createDepartmentModal = document.querySelector<HTMLFormElement>(
  '#create-department-modal'
)

createDepartmentModal?.addEventListener('submit', async function (e) {
  e.preventDefault()
  try {
    const name = createDepartmentModal['department-name'].value.trim()
    const alias = createDepartmentModal['department-alias'].value
      .trim()
      .toUpperCase()
    const color = createDepartmentModal['department-color'].value.trim()
    const response = await fetch('/api/department/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, alias, color })
    })
    const department = await response.json()
    if (response.status > 399) throw new Error(department.message)
    const card = generateDepartmentCard(department)
    createDepartmentButton?.insertAdjacentElement('afterend', card)
    hideModal()
  } catch (error) {
    if (error instanceof Error) alert(error.message)
  }
})

function generateDepartmentCard(department: Department) {
  const card = document.createElement('div')
  card.dataset.referenceId = department.id
  card.className = `bg-${department.color} w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white relative`
  const header = document.createElement('header')
  header.className = 'absolute w-full left-0 top-0 flex justify-between p-4'
  const [checkboxContainer, checkbox] = makeSwitch(!department.isDisabled)
  let abortController: undefined | AbortController
  checkboxContainer.addEventListener('click', async function () {
    if (abortController) {
      abortController.abort()
      abortController = undefined
    }
    try {
      abortController = new AbortController()
      const response = await fetch('/api/department/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: department.id,
          state: !department.isDisabled
        })
      })
      const { isDisabled } = await response.json()
      department.isDisabled = isDisabled
      if (isDisabled) checkbox.removeAttribute('checked')
      else checkbox.setAttribute('checked', 'true')
    } catch (error) {
      alert('An error occurs')
      console.error(error)
    }
  })
  const optionsButton = document.createElement('button')
  optionsButton.title = 'options'
  optionsButton.type = 'button'
  optionsButton.className = 'md:cursor-pointer'
  optionsButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg> 
  `
  const tooltip = document.createElement('div')
  tooltip.className =
    'w-32 h-16 bg-white text-gray-600 rounded-xl font-poppins py-1 modal -z-50 invisible absolute left-24'
  const tooltipUpdate = document.createElement('button')
  tooltipUpdate.type = 'button'
  tooltipUpdate.title = 'update'
  tooltipUpdate.textContent = 'Edit'
  tooltipUpdate.className = 'hover:bg-gray-200 mt-1 px-4 block w-full text-left'
  tooltip.addEventListener('click', function () {
    if (!editDepartmentModal) return
    editDepartmentModal['target-id'].value = department.id
    editDepartmentModal['department-name'].value = department.name
    editDepartmentModal['department-alias'].value = department.alias
    editDepartmentModal['department-color'].value = department.color
    toggleModal('edit-department')
  })
  const tooltipDelete = document.createElement('button')
  tooltipDelete.type = 'button'
  tooltipDelete.title = 'delete'
  tooltipDelete.textContent = 'Delete'
  tooltipDelete.className = 'hover:bg-gray-200 px-4 block w-full text-left'
  tooltipDelete.addEventListener('click', function () {
    if (!deleteDepartmentModal) return
    deleteDepartmentModal['target-id'].value = department.id
    const targetAlias = deleteDepartmentModal.querySelector('#target-alias')
    if (targetAlias) targetAlias.textContent = department.alias
    toggleModal('delete-department')
  })
  tooltip.append(tooltipUpdate, tooltipDelete)
  optionsButton.append(tooltip)
  createPopper(optionsButton, tooltip, { placement: 'left-start' })
  optionsButton.addEventListener('click', function () {
    tooltip.classList.toggle('invisible')
    tooltip.classList.toggle('-z-50')
  })
  header.append(checkboxContainer, optionsButton)
  const container = document.createElement('div')
  container.className = 'w-full h-full grid place-items-center'
  const innerContainer = document.createElement('div')
  innerContainer.className = 'text-center flex flex-col gap-y-4 items-center'
  const h2 = document.createElement('h2')
  h2.className = 'font-poppins text-4xl md:text-2xl lg:text-4xl font-bold'
  h2.append(document.createTextNode(department.alias))
  const p = document.createElement('p')
  p.className = 'md:text-sm lg:text-base'
  p.append(document.createTextNode(department.name))
  innerContainer.append(h2, p)
  container.append(innerContainer)
  card.append(header, container)
  return card
}
