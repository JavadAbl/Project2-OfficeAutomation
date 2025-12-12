import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthLoginRequest } from '../contract/request/auth-login.request';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthDto } from '../contract/dto/auth.dto';
import { AuthCreateRoleRequest } from '../contract/request/auth-create-role.request';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { AuthRoleDto } from '../contract/dto/auth-role.dto';

@Public()
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Login')
  login(@Body() payload: AuthLoginRequest): Promise<AuthDto> {
    return this.authService.login(payload);
  }

  @Get('Role')
  getAuthRoles(@Query() query: GetManyQueryRequest): Promise<AuthRoleDto[]> {
    return this.authService.getAuthRoles(query);
  }

  @Post('Role')
  createAuthRole(@Body() payload: AuthCreateRoleRequest): Promise<number> {
    return this.authService.createAuthRole(payload);
  }
}
