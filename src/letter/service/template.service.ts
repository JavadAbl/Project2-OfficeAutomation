import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Template } from '../entity/template.entity';
import { TemplateCreateRequest } from '../contract/request/template-create.request';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly rep: Repository<Template>,
  ) {}

  async createTemplate(
    payload: TemplateCreateRequest,
    file: Express.Multer.File,
  ) {
    const existingTemplate = await this.rep.findOneBy({ name: payload.name });
    if (existingTemplate)
      throw new ConflictException('Template is already exists');

    const fileName = randomUUID() + '.html';
    const template = this.rep.create({ ...payload, fileName });
    const templateEntity = await this.rep.save(template);

    const publicDir = join(process.cwd(), 'public', 'templates');
    await mkdir(publicDir, { recursive: true });
    const filePath = join(publicDir, fileName);
    await writeFile(filePath, file.buffer);

    return templateEntity.id;
  }
}
