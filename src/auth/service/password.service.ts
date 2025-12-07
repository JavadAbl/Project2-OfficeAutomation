import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';

@Injectable()
export class PasswordService {
  async hash(password: string, saltRounds: number = 10): Promise<string> {
    return await hash(password, saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
