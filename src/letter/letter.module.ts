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
import { E1 } from './entity/e1.entity';
import { E2 } from './entity/e2.entity';
import { IdentityModule } from 'src/identity/identity.module';
import { LetterApproval } from './entity/letter-approval.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Letter,
      LetterApproval,
      Attachment,
      Recipient,
      Template,
      E1,
      E2,
    ]),

    IdentityModule,
  ],
  controllers: [LetterController, TemplateController],
  providers: [LetterService, TemplateService],
})
export class LetterModule {}
