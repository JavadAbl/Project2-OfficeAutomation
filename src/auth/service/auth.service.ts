import { Injectable } from '@nestjs/common';
import { AuthLoginRequest } from '../contract/request/auth-login.request';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(jwtService: JwtService) {}

  async login(payload: AuthLoginRequest) {}
}
