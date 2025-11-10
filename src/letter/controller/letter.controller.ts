import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { LetterService } from '../service/letter.service';
import { LetterSetPriorityRequest } from '../contract/request/letter-set-priority.request';
import { LetterSetTemplateRequest } from '../contract/request/letter-set-template.request';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LetterCreateRecipientRequest } from '../contract/request/letter-create-recipient.request';
import { LetterRecipientDto } from '../contract/dto/letter-recipient.dto';

@Controller('letter')
export class LetterController {
  constructor(private readonly service: LetterService) {}

  @Post()
  createLetterEndpoint() {
    return this.service.create();
  }

  @Patch(':id/SetPriority')
  setLetterPriorityEndpoint(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LetterSetPriorityRequest,
  ): Promise<void> {
    return this.service.setPriority(id, payload);
  }

  @Patch(':id/SetTemplate')
  setLetterTemplateEndpoint(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LetterSetTemplateRequest,
  ): Promise<void> {
    return this.service.setTemplate(id, payload);
  }

  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 1024 * 1024 * 10, files: 10 },
    }),
  )
  @Post(':id/CreateAttachment')
  createAttachmentEndpoint(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    return this.service.addAttachments(id, files);
  }

  @Post(':id/CreateRecipient')
  createLetterRecipientEndpoint(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LetterCreateRecipientRequest,
  ): Promise<LetterRecipientDto> {
    return this.service.createRecipient(id, payload);
  }
}
