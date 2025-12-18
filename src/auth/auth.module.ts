import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './_auth/ controller/auth.controller';
import { AuthService } from './_auth/service/auth.service';
import { HashingProvider } from './_auth/providers/hashing.provider';
import { BCryptProvider } from './_auth/providers/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.type';
import { AppConfig } from 'src/config/app.config';
import { UserModule } from 'src/identity/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';

@Module({
  imports: [
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
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
  exports: [HashingProvider, AuthService],
})
export class AuthModule {}
