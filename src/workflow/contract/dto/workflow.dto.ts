import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentRoleDto } from 'src/identity/department/contract/dto/department-role.dto';
import { TemplateDto } from 'src/letter/template/contract/dto/template.dto';
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
