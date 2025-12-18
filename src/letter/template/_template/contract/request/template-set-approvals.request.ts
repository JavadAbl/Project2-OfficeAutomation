import { ArrayNotEmpty, IsArray, IsPositive } from 'class-validator';

export class TemplateCreateApprovalsRequest {
  @IsArray()
  @ArrayNotEmpty()
  @IsPositive({ each: true })
  departmentRoleIds: number[];
}
