import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RecipientService } from '../service/recipient.service';
import { TokenBody } from 'src/common/decorators/token-payload.decorator';
import { type AccessTokenPayload } from 'src/auth/_auth/contract/interface/access-token-payload.interface';
import { RecipientCreateRequest } from '../contract/request/recipient-create.request';
import { RecipientGetByReceiverRequest } from '../contract/request/recipient-get-by-receiver.request';
import { RecipientGetBySenderRequest } from '../contract/request/recipient-get-by-sender.request';
import { RecipientReceiverDto } from '../contract/dto/recipient-receiver.dto';
import { RecipientSenderDto } from '../contract/dto/recipient-sender.dto';

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

  @Get('GetByReceiver')
  getRecipientsByReceiver(
    @Query() query: RecipientGetByReceiverRequest,
    @TokenBody() TokenBody: AccessTokenPayload,
  ): Promise<RecipientReceiverDto[]> {
    return this.recipientService.getRecipientsByReceiver(query, TokenBody);
  }

  @Get('GetBySender')
  getRecipientsBySender(
    @Query() query: RecipientGetBySenderRequest,
    @TokenBody() TokenBody: AccessTokenPayload,
  ): Promise<RecipientSenderDto[]> {
    return this.recipientService.getRecipientsBySender(query, TokenBody);
  }
}
