import { IsNumber } from 'class-validator';

export class AttachmentCreateRequest {
  @IsNumber()
  letterId: number;
}
