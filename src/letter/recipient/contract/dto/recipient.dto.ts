import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RecipientDto {
  @Expose()
  id: number;

  @Expose()
  letterId: number;

  @Expose()
  senderId: number;
}
