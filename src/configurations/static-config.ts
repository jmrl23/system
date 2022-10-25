import type { ServeStaticOptions } from 'serve-static'

const staticConfig: ServeStaticOptions = {
    maxAge: process.env.NODE_ENV === 'production' ? '31536000' : 'public, max-age=0'
}

export { staticConfig }