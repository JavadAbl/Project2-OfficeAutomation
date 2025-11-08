import { Module } from '@nestjs/common';
import { LetterController } from './controller/letter.controller';
import { LetterService } from './service/letter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entity/letter.entity';
import { Attachment } from './entity/attachment.entity';
import { Recipient } from './entity/recipient.entity';
import { Template } from './entity/template.entity';
import { AttachmentController } from './controller/attachment.controller';
import { AttachmentService } from './service/attachment.service';
import { TemplateService } from './service/template.service';
import { TemplateController } from './controller/template.controller';
import { E1 } from './entity/e1.entity';
import { E2 } from './entity/e2.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter, Attachment, Recipient, Template, E1, E2]),
  ],
  controllers: [LetterController, AttachmentController, TemplateController],
  providers: [LetterService, AttachmentService, TemplateService],
})
export class LetterModule {}
