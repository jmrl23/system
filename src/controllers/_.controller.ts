import { Router } from 'express'

const controller = Router()

controller
  .get('/', function (_request, response) {
    response.render('home', {
      title: 'System'
    })
  })

export { controller }