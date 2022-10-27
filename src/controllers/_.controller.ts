import { Router } from 'express'

const controller = Router()

controller

  .get('/', function (request, response) {
    if (!request.user) return response.redirect('/login')
    response.render('home', {
      title: 'System'
    })
  })

  .get('/login', function (request, response) {
    if (request.user) return response.redirect('/')
    response.render('sign-in')
  })

export { controller }