import type { HelmetOptions } from 'helmet'
import { NONCE } from './env'

const trusted = [`'self'`]

export const helmetConfig: HelmetOptions = {
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: trusted,
      scriptSrc: [`'nonce-${NONCE}'`, 'https://unpkg.com', ...trusted],
      mediaSrc: [...trusted],
      frameSrc: [...trusted],
      imgSrc: [
        'data:',
        'https://*.googleusercontent.com',
        'https://*.google.com',
        ...trusted
      ]
    }
  }
}
