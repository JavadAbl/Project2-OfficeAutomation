import { IsInt } from 'class-validator';

export class LetterSetTemplateRequest {
  @IsInt()
  id: number;

  @IsInt()
  templateId: number;
}
