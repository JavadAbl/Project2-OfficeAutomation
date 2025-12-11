import { IsInt, Min } from 'class-validator';

export class UserSetRoleRequest {
  @IsInt()
  @Min(1)
  roleId: number;
}
