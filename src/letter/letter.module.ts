import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './template/_template/entity/template.entity';
import { TemplateController } from './template/_template/controller/template.controller';
import { TemplateModule } from './template/template.module';
import { RecipientModule } from './recipient/recipient.module';
import { LetterActionModule } from './letter-action/letter-action.module';
import { LetterController } from './_letter/controller/letter.controller';
import { Attachment } from './_letter/entity/attachment.entity';
import { LetterApproval } from './_letter/entity/letter-approval.entity';
import { Letter } from './_letter/entity/letter.entity';
import { LetterApprovalService } from './_letter/service/letter-approval.service';
import { LetterService } from './_letter/service/letter.service';
import { Recipient } from './recipient/_recipient/entity/recipient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter, LetterApproval, Attachment, Recipient, Template]),
    TemplateModule,
    forwardRef(() => RecipientModule),
    LetterActionModule,
  ],
  controllers: [LetterController, TemplateController],
  providers: [LetterService, LetterApprovalService],
  exports: [LetterService],
})
export class LetterModule {}
