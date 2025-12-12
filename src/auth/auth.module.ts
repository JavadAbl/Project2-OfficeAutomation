import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './ controller/auth.controller';
import { AuthService } from './service/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BCryptProvider } from './providers/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.type';
import { AppConfig } from 'src/config/app.config';
import { UserModule } from 'src/identity/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRole } from './entity/auth-role';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthRole]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService<ConfigType>) => ({
        global: true,
        secret: config.get<AppConfig>('app')?.jwtAccessSecret,
        signOptions: { expiresIn: '60m' },
      }),
    }),

    forwardRef(() => UserModule),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HashingProvider, useClass: BCryptProvider },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [HashingProvider, AuthService],
})
export class AuthModule {}
