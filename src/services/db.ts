import { PrismaClient } from '@prisma/client'
import { NODE_ENV } from '../configurations'

export const db = new PrismaClient({
  log: NODE_ENV === 'development' ? ['query', 'warn', 'error'] : undefined
})
