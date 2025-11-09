import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from '../entity/letter.entity';
import { Repository } from 'typeorm';
import { generateLetterNumber } from 'src/common/utils/app.utils';
import { plainToInstance } from 'class-transformer';
import { letterDto } from '../contract/dto/letter.dto';
import { LetterSetPriorityRequest } from '../contract/request/letter-set-priority.request';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter) private readonly rep: Repository<Letter>,
  ) {}

  async create() {
    const letterNumber = generateLetterNumber();
    let newLetter = this.rep.create({ number: letterNumber });
    newLetter = await this.rep.save(newLetter);

    return plainToInstance(letterDto, newLetter);
  }

  async setPriority(payload: LetterSetPriorityRequest) {
    const letter = await this.rep.findOneBy({ id: payload.id });
    if (!letter) throw new NotFoundException('Letter not found');
    letter.priority = payload.priority;
    await this.rep.save(letter);
  }

  async setPriority(payload: LetterSetPriorityRequest) {
    letter.priority = payload.priority;
    await this.rep.save(letter);
  }

  getById(id: number) {
    return this.rep.findOneBy({ id });
  }

  async getAndCheckById(id: number) {}
}
