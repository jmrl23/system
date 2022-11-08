import type { ServeStaticOptions } from 'serve-static'
import { NODE_ENV } from './env'

const staticConfig: ServeStaticOptions = {
  maxAge: NODE_ENV === 'development' ? '0, public' : '365000000, immutable'
}

export { staticConfig }
