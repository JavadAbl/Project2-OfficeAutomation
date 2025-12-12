import { IsPositive } from 'class-validator';

export class UserSetDepartmentRoleRequest {
  @IsPositive()
  departmentRoleId: number;
}
