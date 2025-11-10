import { IsInt } from 'class-validator';

export class LetterCreateRecipientRequest {
  @IsInt()
  userId: number;
}
