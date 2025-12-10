import { Module } from '@nestjs/common';
import { AuthController } from './ controller/auth.controller';
import { AuthService } from './service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from './service/password.service';
import { HashingProvider } from './providers/hashing.provider';
import { BCryptProvider } from './providers/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.type';
import { AppConfig } from 'src/config/app.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigType>) => ({
        global: true,
        secret: config.get<AppConfig>('app')?.jwtAccessSecret,
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    { provide: HashingProvider, useClass: BCryptProvider },
  ],
})
export class AuthModule {}
