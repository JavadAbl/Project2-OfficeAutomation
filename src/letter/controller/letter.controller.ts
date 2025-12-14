import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { LetterService } from '../service/letter.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LetterCreateRequest } from '../contract/request/letter-create.request';
import { type AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { TokenBody } from 'src/common/decorators/token-payload.decorator';
import { letterDto } from '../contract/dto/letter.dto';
import { LetterApprovalSetConfirmRequest } from '../contract/request/letter-approval-set-confirm.request';
import { LetterApprovalService } from '../service/letter-approval.service';
import { letterApprovalDto } from '../contract/dto/letter-approval.dto';

@Controller('Letter')
export class LetterController {
  constructor(
    private readonly service: LetterService,
    private readonly letterApprovalService: LetterApprovalService,
  ) {}

  @Post()
  createLetter(@Body() payload: LetterCreateRequest, @TokenBody() tokenBody: AccessTokenPayload) {
    return this.service.create(payload, tokenBody);
  }

  @UseInterceptors(FilesInterceptor('files', 10, { limits: { fileSize: 1024 * 1024 * 10, files: 10 } }))
  @Post(':id/Attachment')
  createAttachment(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<void> {
    return this.service.addAttachments(id, files);
  }

  @Get(':id')
  getLetterById(@Param('id', ParseIntPipe) id: number, @TokenBody() tokenBody: AccessTokenPayload): Promise<letterDto> {
    return this.service.getLetterById(id, tokenBody);
  }

  @Put(':id/LetterApproval')
  confirmLetterApproval(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: LetterApprovalSetConfirmRequest,
    @TokenBody() tokenBody: AccessTokenPayload,
  ): Promise<void> {
    return this.letterApprovalService.confirmLetterApproval(id, payload.departmentRoleId, tokenBody);
  }

  @Get(':id')
  getLetterApprovals(@TokenBody() tokenBody: AccessTokenPayload): Promise<letterApprovalDto[]> {
    return this.letterApprovalService.getLetterApprovals(tokenBody);
  }
}
