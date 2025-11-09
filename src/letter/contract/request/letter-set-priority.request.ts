import { IsEnum, IsInt } from 'class-validator';
import { LetterPriority } from '../enum/letter-priority.enum';

export class LetterSetPriorityRequest {
  @IsInt()
  id: number;
  @IsEnum(LetterPriority)
  priority: LetterPriority;
}
