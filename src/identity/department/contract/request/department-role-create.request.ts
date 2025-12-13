import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AuthRole } from 'src/auth/enum/auth-role.enum';

export class DepartmentRoleCreateRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AuthRole)
  authRole: AuthRole;
}
