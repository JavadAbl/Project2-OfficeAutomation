import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DepartmentRoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  departmentId: number;

  @Expose()
  authRoleId: number;
}
