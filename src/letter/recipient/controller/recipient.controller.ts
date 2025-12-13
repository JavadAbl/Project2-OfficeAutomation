import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RecipientService } from '../service/recipient.service';
import { TokenBody } from 'src/common/decorators/token-payload.decorator';
import { type AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { RecipientCreateRequest } from '../contract/request/recipient-create.request';
import { RecipientGetManyRequest } from '../contract/request/recipient-get-many.request';

@Controller('Letter/Recipient')
export class RecipientController {
  constructor(private readonly recipientService: RecipientService) {}

  @Post()
  createLetterRecipient(
    @Body() payload: RecipientCreateRequest,
    @TokenBody() tokenPayload: AccessTokenPayload,
  ): Promise<void> {
    return this.recipientService.createRecipient(payload, tokenPayload);
  }

  @Get()
  getRecipients(
    @Query() query: RecipientGetManyRequest,
    @TokenBody() TokenBody: AccessTokenPayload,
  ) {
    return this.recipientService.getRecipients(query, TokenBody);
  }
}
