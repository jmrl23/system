import { Role } from '@prisma/client'
import { IsEnum, IsInt, IsOptional } from 'class-validator'

export class ApiFetchUsers {
  @IsEnum(Role)
  role: Role

  @IsOptional()
  @IsInt()
  skip: number

  @IsOptional()
  @IsInt()
  take: number
}
