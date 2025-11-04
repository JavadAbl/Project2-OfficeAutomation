import { IsString, MinLength } from 'class-validator';

export class UserCreateRequest {
  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(3)
  password: string;

  @IsString()
  departmentId: number;
}
