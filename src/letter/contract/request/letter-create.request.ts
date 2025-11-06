import { IsEnum, IsString } from 'class-validator';
import { LetterPriority } from '../enum/letter-priority.enum';

export class LetterCreateRequest {
  @IsString()
  subject: string;

  @IsEnum(LetterPriority)
  priority: number;
}
