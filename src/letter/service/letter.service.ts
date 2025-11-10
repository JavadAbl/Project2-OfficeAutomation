import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from '../entity/letter.entity';
import { Repository } from 'typeorm';
import {
  generateLetterNumber,
  getFileNameAndExt,
} from 'src/common/utils/app.utils';
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

  async setPriority(id: number, payload: LetterSetPriorityRequest) {
    const { priority } = payload;
    await this.checkById(id);
    await this.rep.update({ id }, { priority });
  }

  async setRecipient() {}

  async addAttachments(id: number, files: Express.Multer.File[]) {
    await this.getAndCheckById(id);
    if (!files || !files.length) throw new BadRequestException('Invalid files');

    const publicDir = join(process.cwd(), 'public', 'attachments');
    await mkdir(publicDir, { recursive: true });

    const attachments = await Promise.all(
      files.map(async (file) => {
        const [name, ext] = getFileNameAndExt(file.originalname);
        const fileName = `${name}-${id}.${ext}`;
        const filePath = join(publicDir, fileName);

        await writeFile(filePath, file.buffer);

        const attachment = this.repAttachment.create({
          letterId: id,
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

  async setTemplate(
    id: number,
    payload: LetterSetTemplateRequest,
  ): Promise<void> {
    const { templateId } = payload;
    await this.checkById(id);
    await this.templateService.checkById(templateId);
    await this.rep.update({ id }, { templateId });
  }

  getById(id: number) {
    return this.rep.findOneBy({ id });
  }
}
