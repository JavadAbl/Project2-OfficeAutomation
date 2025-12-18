import { IsString } from 'class-validator';

export class TemplateCreateRequest {
  @IsString()
  name: string;
}
