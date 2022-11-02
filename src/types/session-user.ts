import { User, UserBasicInfo, UserRole } from '@prisma/client'

interface SessionUser extends User {
  UserBasicInfo?: UserBasicInfo,
  UserRole: UserRole
}

export type { SessionUser }