import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from './service/password.service';
import { HashingProvider } from './providers/hashing.provider';
import { BCryptProvider } from './providers/bcrypt.provider';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    { provide: HashingProvider, useClass: BCryptProvider },
  ],
})
export class AuthModule {}
