import type { HelmetOptions } from 'helmet'
import { NONCE } from './config'

const trusted = [
  '\'self\''
]

const helmetConfig: HelmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: trusted,
      scriptSrc: [`'nonce-${NONCE}'`, ...trusted],
      mediaSrc: [...trusted],
      frameSrc: [...trusted]
    }
  }
}

export { helmetConfig }