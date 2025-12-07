import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentRoleCreateRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}
