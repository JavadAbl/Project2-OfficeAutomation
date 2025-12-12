import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthRoleDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
