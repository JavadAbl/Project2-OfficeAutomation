import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { LetterService } from '../service/letter.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LetterCreateRequest } from '../contract/request/letter-create.request';
import { type AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { TokenBody } from 'src/common/decorators/token-payload.decorator';
import { letterDto } from '../contract/dto/letter.dto';

@Controller('Letter')
export class LetterController {
  constructor(private readonly service: LetterService) {}

  @Post()
  createLetter(@Body() payload: LetterCreateRequest, @TokenBody() TokenBody: AccessTokenPayload) {
    return this.service.create(payload, TokenBody);
  }

  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 1024 * 1024 * 10, files: 10 } }))
  @Post(':id/Attachment')
  createAttachment(@Param('id', ParseIntPipe) id: number, @UploadedFiles() files: Express.Multer.File[]): Promise<void> {
    return this.service.addAttachments(id, files);
  }

  @Get(':id')
  getLetterById(@Param('id', ParseIntPipe) id: number, @TokenBody() TokenBody: AccessTokenPayload): Promise<letterDto> {
    return this.service.getLetterById(id, TokenBody);
  }
}
