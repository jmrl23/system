/**
 * It creates a switch element with a checkbox and a span that moves when the checkbox is checked
 * @param [checked=false] - boolean
 * @returns A label element with a checkbox and span element as children.
 */
export function makeSwitch(isDisabled = false) {
  const container = document.createElement('label')
  container.className =
    'w-[50px] h-[25px] rounded-full inline-block relative bg-[#F0F0F0] overflow-hidden shadow cursor-pointer'
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'peer hidden'
  checkbox.title = 'switch'
  if (!isDisabled) checkbox.setAttribute('checked', 'true')
  const span = document.createElement('span')
  span.className = `w-full h-full left-0 top-0 p-[2px] peer-checked:bg-[#0ACF83] absolute transition-colors before:content-[''] before:w-[17px] before:h-[17px] before:bg-white before:shadow before:rounded-full before:absolute before:left-[4px] before:top-[4px] peer-checked:before:translate-x-[24px] before:transition-transform`
  container.append(checkbox, span)
  return container
}

/**
 * It takes a list of buttons, a container for the pages, and a callback function, and when a button is
 * clicked, it hides all the pages except the one that matches the button's target.
 *
 * The callback function is optional, and is called after the page is toggled.
 *
 * @param buttons - NodeListOf<HTMLButtonElement> - a list of buttons that will be used to toggle the
 * pages
 * @param {HTMLDivElement} pageContainer - The container that holds all the pages.
 * @param callback - (button: HTMLButtonElement) => void = () => void 0
 */
export function pageToggler(
  buttons: NodeListOf<HTMLButtonElement>,
  pageContainer: HTMLDivElement | null,
  callback: (button: HTMLButtonElement) => void = () => void 0
) {
  for (const button of Array.from(buttons)) {
    if (!button.dataset.target) continue
    button.addEventListener('click', function () {
      const pages =
        pageContainer?.querySelectorAll<HTMLDivElement>('[data-content]')
      if (pages) {
        for (const page of Array.from(pages)) {
          page.classList.toggle(
            'hidden',
            page.dataset.content !== button.dataset.target
          )
        }
      }
      callback(button)
    })
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeDepartmentCard(department: any) {
  const container = document.createElement('div')
  container.className = `w-64 h-64 p-4 bg-[${department.color}] text-center rounded-3xl text-white shadow-md shadow-black/30 relative`
  const header = document.createElement('header')
  header.className = 'flex justify-between absolute w-full left-0 top-0 p-4'
  const kebab = document.createElement('button')
  kebab.className = 'kebab'
  kebab.type = 'button'
  kebab.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 ">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  `
  const toggler = makeSwitch(!department.isDisabled)
  toggler.addEventListener('click', async function () {
    try {
      const response = await fetch('/api/department/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: department.id,
          state: !department.isDisabled
        })
      })
      const { isDisabled } = await response.json()
      const checkbox = toggler.querySelector<HTMLInputElement>(
        'input[type=checkbox]'
      )
      department.isDisabled = isDisabled
      if (!isDisabled) {
        checkbox?.removeAttribute('checked')
      } else {
        checkbox?.setAttribute('checked', 'true')
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        alert('An error occurs')
      }
    }
  })
  header.append(toggler, kebab)
  const content = document.createElement('div')
  content.className = 'h-full flex flex-col justify-center gap-y-4 mt-4'
  const alias = document.createElement('p')
  alias.className = 'font-semibold text-5xl font-poppins'
  alias.textContent = department.alias
  const name = document.createElement('p')
  name.textContent = department.name
  content.append(alias, name)
  container.append(header, content)
  return container
}
