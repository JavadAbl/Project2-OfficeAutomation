import { IsInt, Min } from 'class-validator';

export class UserSetDepartmentRequest {
  @IsInt()
  @Min(1)
  departmentId: number;
}
