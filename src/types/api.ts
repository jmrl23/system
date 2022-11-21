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
  @IsEnum(Role, { each: true })
  readonly role: Role[]

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number

  @IsOptional()
  @MinLength(1)
  readonly keyword: string
}

export class ApiUserGet {
  @IsUUID()
  readonly id: string
}

export class ApiUserSetRole {
  @IsEmail()
  readonly email: string

  @IsEnum(Role)
  readonly role: Role
}

export class ApiUserRemoveRole {
  @IsEmail()
  readonly email: string
}

export class ApiUserToggle {
  @IsUUID()
  readonly id: string

  @IsBoolean()
  readonly state: boolean
}

export class ApiDepartmentCreate {
  @Length(6, 100)
  readonly name: string

  @Length(3, 10)
  readonly alias: string

  @Length(6, 20)
  readonly color: string
}

export class ApiDepartmentUpdate {
  @IsUUID()
  readonly id: string

  @Length(6, 100)
  readonly name: string

  @Length(3, 10)
  readonly alias: string

  @Length(6, 20)
  readonly color: string
}

export class ApiDepartmentToggle {
  @IsUUID()
  readonly id: string

  @IsBoolean()
  readonly state: boolean
}

export class ApiDepartmentDelete {
  @IsUUID()
  readonly id: string
}

export class ApiRolesGet {
  @IsEnum(Role, { each: true })
  readonly role: Role[]

  @IsOptional()
  @IsInt()
  readonly skip: number

  @IsOptional()
  @IsInt()
  readonly take: number

  @IsOptional()
  @MinLength(1)
  readonly keyword: string
}
