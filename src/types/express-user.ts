import { Prisma } from '@prisma/client'

export type ExpressUser =
  | Prisma.UserGetPayload<{
      include: {
        UserLevel: true
        UserInfo: true
      }
    }>
  | undefined
