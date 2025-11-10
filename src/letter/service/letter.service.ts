import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from '../entity/letter.entity';
import { Repository } from 'typeorm';
import { generateLetterNumber } from 'src/common/utils/app.utils';
import { plainToInstance } from 'class-transformer';
import { letterDto } from '../contract/dto/letter.dto';
import { LetterSetPriorityRequest } from '../contract/request/letter-set-priority.request';
import { LetterSetTemplateRequest } from '../contract/request/letter-set-template.request';
import { TemplateService } from './template.service';
import { BaseService } from 'src/common/service/base.service';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { Attachment } from '../entity/attachment.entity';

@Injectable()
export class LetterService extends BaseService<Letter> {
  /*   getAndCheckById: typeof CommonService.getAndCheckById =
    CommonService.getAndCheckById.bind(CommonService); */

  constructor(
    @InjectRepository(Letter) rep: Repository<Letter>,

    @InjectRepository(Attachment)
    private readonly repAttachment: Repository<Attachment>,

    private readonly templateService: TemplateService,
  ) {
    super(rep, 'Letter');
  }

  async create() {
    const letterNumber = generateLetterNumber();
    let newLetter = this.rep.create({ number: letterNumber });
    newLetter = await this.rep.save(newLetter);

    return plainToInstance(letterDto, newLetter);
  }

  async setPriority(payload: LetterSetPriorityRequest) {
    const letter = await this.getAndCheckById(payload.id);
    letter.priority = payload.priority;
    await this.rep.save(letter);
  }

  async setRecipient() {}

  async addAttachments(id: number, files: Express.Multer.File[]) {
    const letter = await this.getAndCheckById(id);
    if (!files || !files.length) throw new BadRequestException('Invalid files');

    const publicDir = join(process.cwd(), 'public', 'attachments');
    await mkdir(publicDir, { recursive: true });

    const attachments = await Promise.all(
      files.map(async (file) => {
        const fileName = `${file.originalname}-${letter.id}`;
        const filePath = join(publicDir, fileName);

        await writeFile(filePath, file.buffer);

        const attachment = this.repAttachment.create({
          letter,
          fileName,
        });

        const existingAttachment = await this.repAttachment.findOneBy({
          fileName,
        });
        if (existingAttachment) {
          await this.repAttachment.delete(existingAttachment.id);
        }

        return attachment;
      }),
    );

    await this.repAttachment.save(attachments);
  }

  async setTemplate(payload: LetterSetTemplateRequest): Promise<void> {
    const { id, templateId } = payload;
    const letter = await this.getAndCheckById(id);
    const template = await this.templateService.getAndCheckById(templateId);

    letter.template = template;
    await this.rep.save(letter);
  }

  getById(id: number) {
    return this.rep.findOneBy({ id });
  }
}
