import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthLoginRequest } from '../contract/request/auth-login.request';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthDto } from '../contract/dto/auth.dto';

@Public()
@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('Login')
  login(@Body() payload: AuthLoginRequest): Promise<AuthDto> {
    return this.authService.login(payload);
  }

  @Get('Roles')
  getAuthRoles(): Record<string, any> {
    return this.authService.getAuthRoles();
  }
}
