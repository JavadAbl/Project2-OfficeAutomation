import { IsString } from 'class-validator';

export class WorkflowCreateRequest {
  @IsString()
  name: string;
}
