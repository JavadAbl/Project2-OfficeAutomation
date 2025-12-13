import { forwardRef, Module } from '@nestjs/common';
import { RecipientController } from './controller/recipient.controller';
import { RecipientService } from './service/recipient.service';
import { LetterModule } from '../letter.module';
import { UserModule } from 'src/identity/user/user.module';

@Module({
  imports: [forwardRef(() => LetterModule), UserModule],
  controllers: [RecipientController],
  providers: [RecipientService],
})
export class RecipientModule {}
