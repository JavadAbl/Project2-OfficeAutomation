import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TemplateDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  subject: string;

  @Expose()
  fileName: string;
}
