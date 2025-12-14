import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class letterApprovalDto {
  @Expose()
  id: number;

  @Expose()
  letterId: number;

  @Expose()
  letterSubject: number;

  @Expose()
  createdAt: Date;
}
