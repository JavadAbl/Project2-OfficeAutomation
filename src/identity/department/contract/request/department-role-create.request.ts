import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class DepartmentRoleCreateRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPositive()
  authRoleId: number;
}
