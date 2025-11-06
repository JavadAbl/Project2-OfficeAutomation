import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from '../entity/letter.entity';
import { Repository } from 'typeorm';
import { LetterCreateRequest } from '../contract/request/letter-create.request';

@Controller('letter')
export class LetterController {
  constructor(
    @InjectRepository(Letter) private readonly repLetter: Repository<Letter>,
  ) {}

  async createLetter(payload: LetterCreateRequest) {}
}
