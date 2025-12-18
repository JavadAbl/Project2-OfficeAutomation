// src/auth/jwt-payload.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/auth/_auth/contract/interface/access-token-payload.interface';

export const TokenBody = createParamDecorator((data: unknown, ctx: ExecutionContext): AccessTokenPayload | undefined => {
  const request = ctx.switchToHttp().getRequest<Request>();

  return request.payload;
});
