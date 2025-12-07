import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from './service/password.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
})
export class AuthModule {}
