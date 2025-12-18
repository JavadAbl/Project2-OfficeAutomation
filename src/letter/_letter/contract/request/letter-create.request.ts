import { IsPositive, IsString } from 'class-validator';

export class LetterCreateRequest {
  @IsString()
  subject: string;

  @IsPositive()
  templateId: number;
}
