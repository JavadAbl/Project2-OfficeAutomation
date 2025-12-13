import { forwardRef, Module } from '@nestjs/common';
import { LetterController } from './controller/letter.controller';
import { LetterService } from './service/letter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entity/letter.entity';
import { Attachment } from './entity/attachment.entity';
import { Recipient } from './recipient/entity/recipient.entity';
import { Template } from './template/entity/template.entity';
import { TemplateController } from './template/controller/template.controller';
import { LetterApproval } from './entity/letter-approval.entity';
import { TemplateModule } from './template/template.module';
import { RecipientModule } from './recipient/recipient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter, LetterApproval, Attachment, Recipient, Template]),
    TemplateModule,
    forwardRef(() => RecipientModule),
  ],
  controllers: [LetterController, TemplateController],
  providers: [LetterService],
  exports: [LetterService],
})
export class LetterModule {}
