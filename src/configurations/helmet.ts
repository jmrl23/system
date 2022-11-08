import type { HelmetOptions } from 'helmet'
import { NONCE } from './env'

const trusted = [`'self'`]

const helmetConfig: HelmetOptions = {
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: trusted,
      scriptSrc: [`'nonce-${NONCE}'`, ...trusted],
      mediaSrc: [...trusted],
      frameSrc: [...trusted],
      imgSrc: ['data:', 'https://*.googleusercontent.com', ...trusted]
    }
  }
}

export { helmetConfig }
