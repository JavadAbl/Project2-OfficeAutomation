import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Recipient } from '../entity/recipient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientCreateRequest } from '../contract/request/recipient-create.request';
import { AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { UserService } from 'src/identity/user/service/user.service';
import { LetterService } from 'src/letter/service/letter.service';
import { LetterStatus } from 'src/letter/contract/enum/letter-status.enum';
import { RecipientDto } from '../contract/dto/recipient.dto';
import { RecipientGetManyRequest } from '../contract/request/recipient-get-many.request';

@Injectable()
export class RecipientService extends BaseService<Recipient> {
  constructor(
    @InjectRepository(Recipient) rep: Repository<Recipient>,

    private readonly userService: UserService,

    private readonly letterService: LetterService,
  ) {
    super(rep, Recipient.name);
  }

  async createRecipient(
    payload: RecipientCreateRequest,
    tokenPayload: AccessTokenPayload,
  ): Promise<void> {
    const { userIds, letterId } = payload;
    const { userId: senderId } = tokenPayload;

    for (const userId of userIds) {
      const letter = await this.letterService.getAndCheckExistsById(letterId);
      await this.userService.checkExistsById(userId);

      if (letter.creatorUserId !== senderId)
        throw new UnauthorizedException('this user not owns the letter');

      if ([LetterStatus.pending, LetterStatus.rejected].includes(letter.status))
        throw new BadRequestException(`The letter status is ${LetterStatus[letter.status]}`);

      if (userId === senderId) throw new BadRequestException('Cannot send letter to yourself');

      const recipient = this.rep.create({ letterId, userId });

      await this.rep.save(recipient);
    }
  }

  async getRecipients(
    query: RecipientGetManyRequest,
    tokenPayload: AccessTokenPayload,
  ): Promise<RecipientDto[]> {
    return [];
  }
}
