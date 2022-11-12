import { Role } from '@prisma/client'
import { Router } from 'express'
import { authorization, rateLimiter } from '../middlewares'

const controller = Router()

controller.use(rateLimiter({ max: 50 }))
controller.use('/admin', authorization([Role.ADMIN]))
controller.use('/registry', authorization([Role.REGISTRY]))

// TODO: Make restful API for front-end

export { controller }
