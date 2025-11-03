import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrganizationDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
