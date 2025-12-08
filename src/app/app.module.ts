import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LetterModule } from 'src/letter/letter.module';
import { IdentityModule } from 'src/identity/identity.module';
import { WorkflowModule } from 'src/workflow/workflow.module';
import { AppConfig, appConfig } from 'src/config/app.config';
import { configSchema, ConfigType } from 'src/config/config.type';

const env = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !env ? '.env' : `.env${env}`,
      load: [appConfig],
      validationSchema: configSchema,
    }),

    AuthModule,
    LetterModule,
    IdentityModule,
    WorkflowModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        type: 'better-sqlite3',
        synchronize: true,
        database: configService.get<AppConfig>('app')!.databaseAddress,
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
