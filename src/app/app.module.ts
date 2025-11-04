import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LetterModule } from 'src/letter/letter.module';
import { IdentityModule } from 'src/identity/identity.module';
import { WorkflowModule } from 'src/workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    LetterModule,
    IdentityModule,
    WorkflowModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: 'app.db',
        synchronize: true,
        // database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
      }),
    }),

    //  TypeOrmModule.forFeature([Organization]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
