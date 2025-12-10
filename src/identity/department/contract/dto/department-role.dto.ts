import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DepartmentRoleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
