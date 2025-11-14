import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TemplateCreateRequest } from '../contract/request/template-create.request';
import { TemplateService } from '../service/template.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TemplateDto } from '../contract/dto/template.dto';

@Controller('letter/template')
export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype === 'text/html' ||
          file.originalname.endsWith('.html')
        ) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only HTML files are allowed!'), false);
        }
      },
    }),
  )
  @Post()
  createTemplate(
    @Body() payload: TemplateCreateRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<number> {
    return this.service.create(payload, file);
  }

  @Get()
  getTemplates(): Promise<TemplateDto[]> {
    return this.service.getDtoMany(TemplateDto);
  }

  @Get(':id')
  getTemplateById(@Param('id', ParseIntPipe) id: number): Promise<TemplateDto> {
    return this.service.getDtoById(TemplateDto, id);
  }
}
