import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class WorkflowsDto {
  @Expose()
  id: number;

  @Expose()
  name: string;
}
