import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'

const profileFloater = document.querySelector('#profile-floater')
const profileFloaterOptions = document.querySelector('#profile-floater-options')

if (profileFloater && profileFloaterOptions) {
  createPopper(profileFloater, profileFloaterOptions as HTMLElement)
}

profileFloater?.addEventListener('click', function () {
  profileFloaterOptions?.classList.toggle('invisible')
  profileFloaterOptions?.classList.toggle('-z-50')
})
