import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Template } from '../entity/template.entity';
import { TemplateCreateRequest } from '../contract/request/template-create.request';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { E1 } from '../entity/e1.entity';
import { E2 } from '../entity/e2.entity';
import { TemplateDto } from '../contract/dto/template.dto';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class TemplateService extends BaseService<Template> {
  constructor(
    @InjectRepository(Template)
    rep: Repository<Template>,

    @InjectRepository(E1)
    private readonly repE1: Repository<E1>,

    @InjectEntityManager() private em: EntityManager,
  ) {
    super(rep, 'Template');
  }

  async create(
    payload: TemplateCreateRequest,
    file: Express.Multer.File,
  ): Promise<number> {
    if (!file) throw new BadRequestException('Invalid file');

    await this.checkBy('name', payload.name);

    const fileName = randomUUID() + '.html';
    const template = this.rep.create({ ...payload, fileName });
    const templateEntity = await this.rep.save(template);

    const publicDir = join(process.cwd(), 'public', 'templates');
    await mkdir(publicDir, { recursive: true });
    const filePath = join(publicDir, fileName);
    await writeFile(filePath, file.buffer);

    return templateEntity.id;
  }

  async getDto(): Promise<TemplateDto[]> {
    const templates = await this.rep.find();
    return templates.map((template) => plainToInstance(TemplateDto, template));
  }
}
