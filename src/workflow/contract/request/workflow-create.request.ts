import { IsInt, IsString } from 'class-validator';

export class WorkflowCreateRequest {
  @IsString()
  name: string;

  @IsInt()
  departmentRoleId: number;
}
