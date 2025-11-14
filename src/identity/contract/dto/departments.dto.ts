import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DepartmentsDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
