import { Exclude, Expose, Type } from 'class-transformer';
import { DepartmentsDto } from './departments.dto';
import { DepartmentRoleDto } from './department-role.dto';

@Exclude()
export class DepartmentDto extends DepartmentsDto {
  @Expose()
  @Type(() => DepartmentRoleDto)
  departmentRoles: DepartmentRoleDto[];
}
