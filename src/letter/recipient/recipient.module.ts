import { forwardRef, Module } from '@nestjs/common';
import { RecipientController } from './controller/recipient.controller';
import { RecipientService } from './service/recipient.service';
import { LetterModule } from '../letter.module';
import { UserModule } from 'src/identity/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipient } from './entity/recipient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipient]), forwardRef(() => LetterModule), UserModule],
  controllers: [RecipientController],
  providers: [RecipientService],
  exports: [RecipientService],
})
export class RecipientModule {}
