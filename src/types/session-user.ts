import { User, UserBasicInfo, UserRole } from '@prisma/client'

export interface SessionUser extends User {
  UserBasicInfo?: UserBasicInfo
  UserRole: UserRole
}
