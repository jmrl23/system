/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'
import { makeSwitch, pageToggler } from './helper.js'
import type { Department } from '@prisma/client'

const sidenavButtons =
  document.querySelectorAll<HTMLButtonElement>('.sidenav button')

const editDepartmentModal = document.querySelector<HTMLFormElement>(
  '#edit-department-modal'
)

const deleteDepartmentModal = document.querySelector<HTMLFormElement>(
  '#delete-department-modal'
)

const deleteUserModal = document.querySelector<HTMLFormElement>(
  '#delete-student-modal'
)

const modalContainer = document.querySelector('#modal-container')
const modal = modalContainer?.querySelector('#modal')
const modalCloseButtons = document.querySelectorAll('[data-action=close-modal]')

for (const button of Array.from(modalCloseButtons)) {
  button.addEventListener('click', hideModal)
}

const studentListContainer =
  document.querySelector<HTMLTableElement>('#students-list')

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

const CONFIG = {
  paginationTakeRate: 10
}

const STATUS = {
  studentPaginationSkip: 0,
  userListDepartmentFilterValue: 'placeholder'
}

;(async function () {
  const [students, departments] = await Promise.all([
    getStudents(STATUS.studentPaginationSkip, CONFIG.paginationTakeRate),
    getDepartments()
  ])
  void loadStudentList(students)
  void loadDepartmentCards(departments)
  void initializePaginationButtons()
  void refreshFilterSelects()
})()

function loadStudentList(students: any[]) {
  const rows = students.map(generateUserRow)
  const tbody = document.querySelector('#students-list')
  if (!tbody) return
  tbody.innerHTML = ''
  tbody.append(...rows)
}

function generateDepartmentCard(department: Department) {
  const card = document.createElement('div')
  card.dataset.referenceId = department.id
  card.className = `bg-${department.color} w-[300px] h-[300px] md:w-[200px] md:h-[200px] lg:w-[300px] lg:h-[300px] rounded-lg p-4 text-white relative shadow`
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
      ;(checkbox as HTMLInputElement).checked = !isDisabled
    } catch (error) {
      if (error instanceof Error) console.error(error.message)
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
    'w-32 h-16 bg-white text-gray-600 rounded-xl font-poppins py-1 modal -z-50 invisible absolute left-24 overflow-hidden'
  const tooltipUpdate = document.createElement('button')
  tooltipUpdate.type = 'button'
  tooltipUpdate.title = 'update'
  tooltipUpdate.textContent = 'Edit'
  tooltipUpdate.className = 'hover:bg-gray-200 mt-1 px-4 block w-full text-left'
  tooltipUpdate.addEventListener('click', function () {
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

function loadDepartmentCards(departments: any[]) {
  const departmentCards = departments.map(generateDepartmentCard)
  const departmentsContainer = document.querySelector('#departments-container')
  departmentsContainer?.append(...departmentCards)
}

function initializePaginationButtons() {
  const studentsPaginationPreviousButton = document.querySelector(
    '#students-pagination-previous-button'
  )
  const studentsPaginationNextButton = document.querySelector(
    '#students-pagination-next-button'
  )
  let studentsPaginationOnprocess = false
  studentsPaginationPreviousButton?.addEventListener(
    'click',
    async function () {
      if (studentsPaginationOnprocess) return
      studentsPaginationOnprocess = true
      studentsPaginationPreviousButton.classList.add('cursor-not-allowed')
      studentsPaginationNextButton?.classList.add('cursor-not-allowed')
      studentsPaginationPreviousButton.setAttribute('disabled', 'disabled')
      studentsPaginationNextButton?.setAttribute('disabled', 'disabled')
      const students = await getStudents(
        STATUS.studentPaginationSkip,
        CONFIG.paginationTakeRate
      )
      STATUS.studentPaginationSkip -= CONFIG.paginationTakeRate
      if (STATUS.studentPaginationSkip < 0) STATUS.studentPaginationSkip = 0
      studentsPaginationPreviousButton.classList.remove('cursor-not-allowed')
      studentsPaginationNextButton?.classList.remove('cursor-not-allowed')
      studentsPaginationPreviousButton.removeAttribute('disabled')
      studentsPaginationNextButton?.removeAttribute('disabled')
      studentsPaginationOnprocess = false
      if (students.length < 1) {
        STATUS.studentPaginationSkip -= CONFIG.paginationTakeRate
        return
      }
      loadStudentList(students)
    }
  )
  studentsPaginationNextButton?.addEventListener('click', async function () {
    if (studentsPaginationOnprocess) return
    studentsPaginationOnprocess = true
    studentsPaginationPreviousButton?.classList.add('cursor-not-allowed')
    studentsPaginationNextButton.classList.add('cursor-not-allowed')
    studentsPaginationPreviousButton?.setAttribute('disabled', 'disabled')
    studentsPaginationNextButton.setAttribute('disabled', 'disabled')
    const students = await getStudents(
      STATUS.studentPaginationSkip,
      CONFIG.paginationTakeRate
    )
    STATUS.studentPaginationSkip -= CONFIG.paginationTakeRate
    if (STATUS.studentPaginationSkip < 0) STATUS.studentPaginationSkip = 0
    studentsPaginationPreviousButton?.classList.remove('cursor-not-allowed')
    studentsPaginationNextButton.classList.remove('cursor-not-allowed')
    studentsPaginationPreviousButton?.removeAttribute('disabled')
    studentsPaginationNextButton.removeAttribute('disabled')
    studentsPaginationOnprocess = false
    if (students.length < 1) return
    loadStudentList(students)
  })
}

function generateUserRow(user: any) {
  const row = document.createElement('tr')
  const statusContainer = document.createElement('td')
  const emailContainer = document.createElement('td')
  const nameContainer = document.createElement('td')
  const departmentContainer = document.createElement('td')
  const actionContainer = document.createElement('td')
  const [checkboxContainer, checkbox] = makeSwitch(!user.isDisabled)
  let abortController: undefined | AbortController
  checkboxContainer.addEventListener('click', async function () {
    if (abortController) {
      abortController.abort()
      abortController = undefined
    }
    try {
      abortController = new AbortController()
      const response = await fetch('/api/user/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          state: !user.isDisabled
        })
      })
      const { isDisabled } = await response.json()
      user.isDisabled = isDisabled
      const _checkbox = checkbox as HTMLInputElement
      _checkbox.checked = !isDisabled
    } catch (error) {
      if (error instanceof Error) console.error(error.message)
    }
  })
  statusContainer.append(checkboxContainer)
  emailContainer.append(document.createTextNode(user.email))
  nameContainer.append(document.createTextNode(user.displayName))
  departmentContainer.append(
    document.createTextNode(user.department ? user.department.alias : 'N/A')
  )
  if (!user.department) departmentContainer.classList.add('text-gray-400')
  const buttonsContainer = document.createElement('div')
  buttonsContainer.className = 'flex gap-x-2'
  const viewButton = document.createElement('a')
  viewButton.className = 'btn'
  viewButton.title = 'View'
  viewButton.append(document.createTextNode('View'))
  viewButton.href = `/${user.email}`
  viewButton.target = '_blank'
  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.className = 'btn btn-red'
  deleteButton.title = 'Delete'
  deleteButton.append(document.createTextNode('Delete'))
  deleteButton.addEventListener('click', function () {
    if (!deleteUserModal) return
    const targetEmailRef = deleteUserModal?.querySelector<HTMLInputElement>(
      'input[name=target-email-ref]'
    )
    const targetEmail =
      deleteUserModal?.querySelector<HTMLSpanElement>('#target-email-0')
    if (targetEmailRef) targetEmailRef.value = user.email
    if (targetEmail) targetEmail.textContent = user.email
    toggleModal('delete-student')
  })
  buttonsContainer.append(viewButton, deleteButton)
  actionContainer.append(buttonsContainer)
  row.append(
    statusContainer,
    emailContainer,
    nameContainer,
    departmentContainer,
    actionContainer
  )
  return row
}

const userListDepartmentFilter = document.querySelector<HTMLSelectElement>(
  '#user-list-department-filter'
)

async function refreshFilterSelects() {
  const [departments] = await Promise.all([getDepartments()])
  if (userListDepartmentFilter) {
    userListDepartmentFilter.innerHTML = ''
    const placeholderOption = document.createElement('option')
    placeholderOption.value = 'placeholder'
    placeholderOption.textContent = 'Filter by Department'
    const values: string[] = []
    const departmentsOptions = departments.map((d: any) => {
      const option = document.createElement('option')
      option.value = d.alias
      option.textContent = d.alias
      values.push(d.alias)
      return option
    })
    userListDepartmentFilter.append(placeholderOption, ...departmentsOptions)
    userListDepartmentFilter.removeEventListener(
      'change',
      filterStudentsListByDepartment
    )
    userListDepartmentFilter.addEventListener(
      'change',
      filterStudentsListByDepartment
    )
    const valueExists = values.includes(STATUS.userListDepartmentFilterValue)
    userListDepartmentFilter.value = !valueExists
      ? 'placeholder'
      : STATUS.userListDepartmentFilterValue
    STATUS.userListDepartmentFilterValue = userListDepartmentFilter.value
  }
}

function filterStudentsListByDepartment() {
  const selected: string = userListDepartmentFilter?.value ?? 'placeholder'
  STATUS.userListDepartmentFilterValue = selected
  const tableDepartments = studentListContainer?.querySelectorAll(
    'tr > td:nth-child(4)'
  )
  for (const td of Array.from(tableDepartments || [])) {
    td.parentElement?.classList.add('hidden')
    if (selected === 'placeholder') {
      td.parentElement?.classList.remove('hidden')
      continue
    }
    if (td.textContent === selected)
      td.parentElement?.classList.remove('hidden')
  }
}

async function getStudents(
  skip = 0,
  take = 15,
  keyword: string | undefined = undefined
) {
  const students = await getUsers(['STUDENT'], skip, take, keyword)
  return students
}

async function getDepartments() {
  try {
    const response = await fetch('/api/departments/get', { method: 'POST' })
    const departments = await response.json()
    if (departments.error) throw new Error(departments.error)
    return departments
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return []
  }
}

function toggleModal(target: string) {
  modalContainer?.classList.add('grid')
  modalContainer?.classList.remove('hidden')
  for (const modalContent of Array.from(modal?.children || [])) {
    const content = modalContent as HTMLDivElement
    content.classList.toggle('hidden', content.dataset.content !== target)
  }
  document.body.classList.add('overflow-hidden')
}

function hideModal() {
  modalContainer?.classList.remove('grid')
  modalContainer?.classList.add('hidden')
  const inputs = modal?.querySelectorAll<HTMLInputElement>(
    'input[type=text], input[type=hidden], input[type=email]'
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

async function getUsers(
  role: string[],
  skip = 0,
  take = 15,
  keyword: string | undefined = undefined
): Promise<unknown[]> {
  try {
    const response = await fetch('/api/users/get', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, skip, take, keyword })
    })
    const users = await response.json()
    if (users.error) throw new Error(users.error)
    return users
  } catch (error) {
    if (error instanceof Error) console.error(error.message)
    return []
  }
}
