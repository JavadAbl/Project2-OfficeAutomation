import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '../entity/attachment.entity';
import { Repository } from 'typeorm';
import { AttachmentCreateRequest } from '../contract/request/attachment-create.request';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { LetterService } from './letter.service';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly rep: Repository<Attachment>,
    private readonly letterService: LetterService,
  ) {}

  async create(
    payload: AttachmentCreateRequest,
    files: Express.Multer.File[],
  ): Promise<void> {
    const publicDir = join(process.cwd(), 'public', 'attachments');
    await mkdir(publicDir, { recursive: true });

    const letter = await this.letterService.getById(payload.letterId);
    if (!letter) throw new NotFoundException('Letter not found');

    const attachments = files.map((file) =>
      this.rep.create({
        letter: letter,
        fileName: `${file.originalname}-${letter.id}`,
      }),
    );

    await this.rep.save(attachments);
  }
}
