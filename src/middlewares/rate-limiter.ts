import limiter from 'express-rate-limit'

const rateLimiter = limiter({
  windowMs: 5 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
})

export { rateLimiter }