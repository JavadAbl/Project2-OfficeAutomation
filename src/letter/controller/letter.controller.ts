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

@Controller('letter')
export class LetterController {
  constructor(private readonly service: LetterService) {}

  @Post()
  createLetterEndpoint() {
    return this.service.create();
  }

  @Patch('SetPriority')
  setLetterPriorityEndpoint(
    @Body() payload: LetterSetPriorityRequest,
  ): Promise<void> {
    return this.service.setPriority(payload);
  }

  @Patch('SetTemplate')
  setLetterTemplateEndpoint(
    @Body() payload: LetterSetTemplateRequest,
  ): Promise<void> {
    return this.service.setTemplate(payload);
  }

  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: { fileSize: 1024 * 1024 * 10, files: 10 },
    }),
  )
  @Post('AddAttachment/:id')
  setLetterAttachmentEndpoint(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    return this.service.addAttachments(id, files);
  }
}
