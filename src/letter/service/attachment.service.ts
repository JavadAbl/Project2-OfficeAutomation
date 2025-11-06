import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from '../entity/attachment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repAttachment: Repository<Attachment>,
  ) {}
}
