/**
 * It creates a switch element with a checkbox and a span element
 * @param [checked=false] - boolean
 * @returns An array of two elements. The first element is the label element. The second element is the
 * input element.
 */
export function makeSwitch(checked = false) {
  const container = document.createElement('label')
  container.className =
    'w-[50px] h-[25px] rounded-full inline-block relative bg-[#F0F0F0] overflow-hidden shadow cursor-pointer'
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'peer hidden'
  checkbox.title = 'switch'
  checkbox.checked = checked
  const span = document.createElement('span')
  span.className = `w-full h-full left-0 top-0 p-[2px] peer-checked:bg-[#0ACF83] absolute transition-colors before:content-[''] before:w-[17px] before:h-[17px] before:bg-white before:shadow before:rounded-full before:absolute before:left-[4px] before:top-[4px] peer-checked:before:translate-x-[24px] before:transition-transform`
  container.append(checkbox, span)
  return [container, checkbox]
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
      const pages = pageContainer?.children as
        | NodeListOf<HTMLDivElement>
        | undefined
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
