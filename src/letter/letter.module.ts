import { Module } from '@nestjs/common';
import { LetterController } from './controller/letter.controller';
import { LetterService } from './service/letter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entity/letter.entity';
import { Attachment } from './entity/attachment.entity';
import { Recipient } from './entity/recipient.entity';
import { Template } from './entity/template.entity';
import { TemplateService } from './service/template.service';
import { TemplateController } from './controller/template.controller';
import { LetterApproval } from './entity/letter-approval.entity';
import { UserModule } from 'src/identity/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      LetterApproval,
      Attachment,
      Recipient,
      Template,
    ]),

    UserModule,
  ],
  controllers: [LetterController, TemplateController],
  providers: [LetterService, TemplateService],
  exports: [TemplateService],
})
export class LetterModule {}
