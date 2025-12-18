import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCreateRoleRequest {
  @IsString()
  @IsNotEmpty()
  name: string;
}
