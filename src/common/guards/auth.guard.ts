import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { PUBLIC_KEY } from '../constants/keys';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization?.split(' ');
    const token = authHeader?.[1];

    if (!token) throw new UnauthorizedException('there is no jwt token');

    try {
      const payload: AccessTokenPayload =
        await this.jwtService.verifyAsync(token);
      request.payload = payload;
    } catch {
      throw new UnauthorizedException('Invalid jwt token');
    }
    return true;
  }
}
