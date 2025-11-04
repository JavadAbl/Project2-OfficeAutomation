import { IsString } from 'class-validator';

export class DepartmentCreateRequest {
  @IsString()
  name: string;
}
