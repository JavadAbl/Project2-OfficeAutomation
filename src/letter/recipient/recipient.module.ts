import { forwardRef, Module } from '@nestjs/common';
import { RecipientController } from './_recipient/controller/recipient.controller';
import { RecipientService } from './_recipient/service/recipient.service';
import { LetterModule } from '../letter.module';
import { UserModule } from 'src/identity/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipient } from './_recipient/entity/recipient.entity';
import { TemplateModule } from '../template/template.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipient]),
    forwardRef(() => LetterModule),
    UserModule,
    TemplateModule,
  ],
  controllers: [RecipientController],
  providers: [RecipientService],
  exports: [RecipientService],
})
export class RecipientModule {}
