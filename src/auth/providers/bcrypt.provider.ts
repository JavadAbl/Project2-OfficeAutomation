import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { compare, genSalt, hash } from 'bcryptjs';

@Injectable()
export class BCryptProvider implements HashingProvider {
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }
  comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }
}
