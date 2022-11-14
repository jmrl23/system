import { Prisma } from '@prisma/client'

export type ExpressUser =
  | Prisma.UserGetPayload<{
      include: {
        UserLevel: true
        StudentInformation: true
      }
    }>
  | undefined
