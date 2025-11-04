import { IsString } from 'class-validator';

export class LetterCreateRequest {
  @IsString()
  name: string;
}
