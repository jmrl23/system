import { Role } from '@prisma/client'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  Length,
  MinLength
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

  @IsOptional()
  @MinLength(1)
  keyword: string
}

export class ApiUserGet {
  @IsUUID()
  id: string
}

export class ApiUserSetRole {
  @IsEmail()
  email: string

  @IsEnum(Role)
  role: Role
}

export class ApiUserRemoveRole {
  @IsEmail()
  email: string
}

export class ApiUserToggle {
  @IsUUID()
  id: string

  @IsBoolean()
  state: boolean
}

export class ApiDepartmentCreate {
  @Length(6, 100)
  name: string

  @Length(3, 10)
  alias: string

  @Length(6, 8)
  color: string
}

export class ApiDepartmentUpdate {
  @IsUUID()
  id: string

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

export class ApiDepartmentDelete {
  @IsUUID()
  id: string
}
