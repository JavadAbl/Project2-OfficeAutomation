import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from '../service/attachment.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AttachmentCreateRequest } from '../contract/request/attachment-create.request';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly service: AttachmentService) {}

  @UseInterceptors(
    FilesInterceptor('file', 10, {
      limits: { fileSize: 1024 * 1024 * 10 },
    }),
  )
  @Post()
  createAttachmentEndpoint(
    @Body() payload: AttachmentCreateRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<number> {
    return this.service.create(payload, files);
  }
}
