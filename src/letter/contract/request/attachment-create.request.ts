import { IsNumber } from 'class-validator';

export class AttachmentCreateRequest {
  @IsNumber()
  postId: number;
}
