import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DepartmentDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
