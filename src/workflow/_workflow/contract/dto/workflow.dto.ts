import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentRoleDto } from 'src/identity/department/_department/contract/dto/department-role.dto';
import { WorkflowsDto } from './workflows.dto';

@Exclude()
export class WorkflowDto extends WorkflowsDto {
  @Expose()
  @Type(() => DepartmentRoleDto)
  departmentRoles: DepartmentRoleDto[];
}
