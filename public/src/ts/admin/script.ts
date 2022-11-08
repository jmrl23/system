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

async function fetchStudents(skip = 0, take = 10) {
  const table =
    document.querySelector<HTMLDivElement>('#student-list')?.parentElement
  try {
    table?.classList.add('hidden')
    const response = await fetch(`/api/student-list?skip=${skip}&take=${take}`)
    const collection = await response.json()
    table?.classList.remove('hidden')
    return collection
  } catch (error) {
    if (error instanceof Error) alert(error.message)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function printTable(data: any[]) {
  const container = document.querySelector<HTMLDivElement>('#student-list')
  const output = data.map((item) => {
    const row = document.createElement('tr')
    const email = document.createElement('td')
    const name = document.createElement('td')
    email.className = 'px-4 py-2 border border-gray-100'
    email.append(document.createTextNode(item.email))
    name.className = 'px-4 py-2 border border-gray-100'
    name.append(document.createTextNode(item.displayName))
    row.append(email, name)
    return row
  })
  container?.append(...output)
}

fetchStudents().then(printTable)
