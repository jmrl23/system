import type { HelmetOptions } from 'helmet'
import { NONCE } from './config'

const trusted = [
  `'self'`,
  'lh3.googleusercontent.com'
]

const helmetConfig: HelmetOptions = {
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: trusted,
      scriptSrc: [`'nonce-${NONCE}'`, ...trusted],
      mediaSrc: [...trusted],
      frameSrc: [...trusted],
      imgSrc: ['data:', ...trusted]
    }
  }
}

export { helmetConfig }