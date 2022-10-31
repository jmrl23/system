import sharp from 'sharp'
import axios from 'axios'
import { Router } from 'express'
import { BadRequestError, InternalServerError, NotFoundError } from 'express-response-errors'
import { existsSync } from 'fs'
import { join } from 'path'
import { cache } from '../services'
import type { Request, Response, NextFunction } from 'express'

const controller = Router()

controller

  .get('/', async function (request: Request, response: Response, next: NextFunction) {
    const source = request.query.s as string
    if (!source) return next(new BadRequestError('No source'))
    const cachedData = await cache.get(`lazy-image-${source}`)
    if (typeof cachedData === 'string') return response.end(cachedData)
    if (source.startsWith('http')) {
      try {
        const data = await (await axios.get(source, { responseType: 'arraybuffer' })).data
        const base64 = convert(data)
        await cache.put(`lazy-image-${source}`, base64)
        return response.end(base64)
      } catch (error) {
        if (error instanceof Error)
          return next(new BadRequestError(error.message))
      }
    }
    try {
      if (!source.startsWith('/')) return next(new BadRequestError('Invalid source'))
      const sourceLocation = join(__dirname, '../../public/static', source)
      if (!existsSync(sourceLocation))
        return next(new NotFoundError('Source image not found'))
      const base64 = convert(sourceLocation)
      await cache.put(`lazy-image-${source}`, base64)
      response.end(base64)
    } catch (error) {
      const message = error instanceof Error ? error.message : void 0
      next(new InternalServerError(message))
    }
  })

async function convert(data: string) {
  const result = await sharp(data)
    .resize(1, 1)
    .toBuffer()
  const base64 = `data:image/gif;base64,${result.toString('base64')}`
  return base64
}

export { controller }