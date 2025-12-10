import { IsNotEmpty, IsString } from 'class-validator';

export class DepartmentCreateRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}
