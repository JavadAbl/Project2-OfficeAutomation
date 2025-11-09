import { Injectable } from '@nestjs/common';
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

@Injectable()
export class LetterService extends BaseService<Letter> {
  /*   getAndCheckById: typeof CommonService.getAndCheckById =
    CommonService.getAndCheckById.bind(CommonService); */

  constructor(
    @InjectRepository(Letter) rep: Repository<Letter>,
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
