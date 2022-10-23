import { type Express, Router } from 'express'
import listEndpoints from 'express-list-endpoints'
import recursive from 'recursive-readdir'
import clc from 'cli-color'

const controller = Router()

recursive(__dirname, ['!*.controller.{ts,js}'])
  .then(async files => {
    for (const file of files) {
      const { controller: _controller } = await import(file)
      if (typeof _controller !== 'function') continue
      const path = file
        .replace(__dirname, '')
        .substring(1)
        .replace(/\.controller\.(ts|js)$/g, '')
        .replace(/^_+/g, '')
        .toLowerCase()
      controller.use(`/${path}`, _controller)
      const endpoints = listEndpoints(_controller as Express)
      console.log(clc.bold.bgBlueBright(' CONTROLLER ') + clc.black.bgWhite(` ${path} `))
      for (const endpoint of endpoints) {
        const { methods, path } = endpoint
        console.log(` - [${methods.join(', ')}] ${path}`)
      }
      console.log()
    }
  })

export * from './404'
export { controller }