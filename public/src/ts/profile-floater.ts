import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'
;(function () {
  const profileFloaterContainer = document.querySelector<HTMLDivElement>(
    '#profile-floater-container'
  )
  const profileFloater =
    profileFloaterContainer?.querySelector<HTMLDivElement>('#profile-floater')
  const profileFloaterOptions =
    profileFloaterContainer?.querySelector<HTMLDivElement>(
      '#profile-floater-options'
    )

  if (profileFloater && profileFloaterOptions)
    createPopper(profileFloater, profileFloaterOptions)

  profileFloaterContainer?.addEventListener('click', function () {
    profileFloaterOptions?.classList.toggle('invisible')
    profileFloaterOptions?.classList.toggle('-z-50')
  })
})()
