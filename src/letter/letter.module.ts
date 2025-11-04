import { Module } from '@nestjs/common';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Letter } from './entity/letter.entity';
import { Attachment } from './entity/attachment.entity';
import { Recipient } from './entity/recipient.entity';
import { Template } from './entity/template.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Letter, Attachment, Recipient, Template]),
  ],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
