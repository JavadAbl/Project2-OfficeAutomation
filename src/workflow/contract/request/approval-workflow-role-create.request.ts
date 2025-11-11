import { IsInt } from 'class-validator';

export class ApprovalWorkflowRoleCreateRequest {
  @IsInt()
  departmentRoleId: number;
}
