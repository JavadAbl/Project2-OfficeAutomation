import { IsEnum } from 'class-validator';
import { LetterPriority } from '../enum/letter-priority.enum';

export class LetterSetPriorityRequest {
  @IsEnum(LetterPriority)
  priority: LetterPriority;
}
