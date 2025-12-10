import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UserCreateRequest {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(3)
  password: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  departmentId: number;
}
