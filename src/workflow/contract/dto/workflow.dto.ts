import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentRoleDto } from 'src/identity/contract/dto/department-role.dto';
import { TemplateDto } from 'src/letter/contract/dto/template.dto';
import { WorkflowsDto } from './workflows.dto';

@Exclude()
export class WorkflowDto extends WorkflowsDto {
  @Expose()
  @Type(() => TemplateDto)
  templates: TemplateDto[];

  @Expose()
  @Type(() => DepartmentRoleDto)
  departmentRoles: DepartmentRoleDto[];
}
