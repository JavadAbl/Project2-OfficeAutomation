import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from '../entity/letter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter) private readonly repLetter: Repository<Letter>,
  ) {}

  createLetter() {}
}
