import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LetterRecipientDto {
  @Expose()
  id: number;

  @Expose()
  letterId: number;

  @Expose()
  userId: number;
}
