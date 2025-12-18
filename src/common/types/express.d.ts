import { Request } from 'express';
import { AccessTokenPayload } from 'src/auth/_auth/contract/interface/access-token-payload.interface';

declare global {
  namespace Express {
    interface Request {
      payload?: AccessTokenPayload;
    }
  }
}
