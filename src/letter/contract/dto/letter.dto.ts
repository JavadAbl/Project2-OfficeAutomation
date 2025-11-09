import { Exclude, Expose, Transform } from 'class-transformer';
import { LetterStatus } from '../enum/letter-status.enum';
import { LetterPriority } from '../enum/letter-priority.enum';

@Exclude()
export class letterDto {
  @Expose()
  id: number;

  @Expose()
  number: number;

  @Expose()
  subject: string;

  @Expose()
  body: string;

  @Expose()
  status: LetterStatus;

  @Expose()
  @Transform(({ obj }) => LetterStatus[obj.status])
  statusTitle: string;

  @Expose()
  priority: string;

  @Expose()
  @Transform(({ obj }) => LetterPriority[obj.priority])
  priorityTitle: string;

  @Expose()
  templateId: number;
}
