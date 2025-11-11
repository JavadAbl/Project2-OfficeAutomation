import { IsString } from 'class-validator';

export class DepartmentRoleCreateRequest {
  @IsString()
  name: string;
}
