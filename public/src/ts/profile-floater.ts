import { createPopper } from 'https://unpkg.com/@popperjs/core@2.11.6/dist/esm/index.js'
;(function () {
  const profileFloater = document.querySelector('#profile-floater')
  const profileFloaterOptions = document.querySelector(
    '#profile-floater-options'
  )

  if (profileFloater && profileFloaterOptions)
    createPopper(profileFloater, profileFloaterOptions as HTMLElement)

  profileFloater?.addEventListener('click', function () {
    profileFloaterOptions?.classList.toggle('invisible')
    profileFloaterOptions?.classList.toggle('-z-50')
  })

  function initializeSignoutBtn() {
    const signoutButton = document.querySelector('#profile-floater-signout-btn')
    let abortController: AbortController | null = null
    if (!signoutButton) return
    signoutButton.addEventListener('click', async function (e) {
      e.preventDefault()
      if (abortController instanceof AbortController) abortController.abort()
      try {
        abortController = new AbortController()
        const response = await fetch('/auth/logout', {
          method: 'POST',
          signal: abortController.signal
        })
        const { ok } = await response.json()
        if (ok) location.href = '/'
      } catch (error) {
        if (error instanceof Error) alert(error.message)
      }
    })
  }
  void initializeSignoutBtn()
})()
