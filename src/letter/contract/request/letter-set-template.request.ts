import { IsInt } from 'class-validator';

export class LetterSetTemplateRequest {
  @IsInt()
  templateId: number;
}
