import { Role } from '@prisma/client'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Length
} from 'class-validator'

export class ApiUsersGet {
  @IsEnum(Role)
  role: Role

  @IsOptional()
  @IsInt()
  skip: number

  @IsOptional()
  @IsInt()
  take: number
}

export class ApiUserSetRole {
  @IsEmail()
  email: string

  @IsEnum(Role)
  role: Role
}

export class ApiDepartmentCreate {
  @Length(6, 100)
  name: string

  @Length(3, 10)
  alias: string

  @Length(6, 8)
  color: string
}

export class ApiDepartmentToggle {
  @IsUUID()
  id: string

  @IsBoolean()
  state: boolean
}

export class ApiUserToggle {
  @IsUUID()
  id: string

  @IsBoolean()
  state: boolean
}
