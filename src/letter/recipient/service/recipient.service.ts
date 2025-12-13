import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Recipient } from '../entity/recipient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { RecipientCreateRequest } from '../contract/request/recipient-create.request';
import { AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { UserService } from 'src/identity/user/service/user.service';
import { LetterService } from 'src/letter/service/letter.service';
import { LetterStatus } from 'src/letter/contract/enum/letter-status.enum';
import { RecipientDto } from '../contract/dto/recipient.dto';
import { RecipientGetManyRequest } from '../contract/request/recipient-get-many.request';
import { mapQueryToFindOptions } from 'src/common/utils/typeorm.utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RecipientService extends BaseService<Recipient> {
  constructor(
    @InjectRepository(Recipient) rep: Repository<Recipient>,

    private readonly userService: UserService,

    private readonly letterService: LetterService,
  ) {
    super(rep, Recipient.name);
  }

  async createRecipient(payload: RecipientCreateRequest, tokenPayload: AccessTokenPayload): Promise<void> {
    const { userIds, letterId } = payload;
    const { userId: senderId } = tokenPayload;

    for (const userId of userIds) {
      const letter = await this.letterService.getAndCheckExistsById(letterId);
      await this.userService.checkExistsById(userId);

      if (letter.creatorUserId !== senderId) throw new ForbiddenException('this user not owns the letter');

      if ([LetterStatus.pending, LetterStatus.rejected].includes(letter.status))
        throw new BadRequestException(`The letter status is ${LetterStatus[letter.status]}`);

      if (userId === senderId) throw new BadRequestException('Cannot send letter to yourself');

      const recipient = this.rep.create({ letterId, receiverId: userId, senderId });

      await this.rep.save(recipient);
    }
  }

  async getRecipientsToUser(query: RecipientGetManyRequest, tokenPayload: AccessTokenPayload): Promise<RecipientDto[]> {
    const { receiverId, senderUsername, letterSubject, ...restQuery } = query;

    if (receiverId !== tokenPayload.userId) throw new ForbiddenException('Cant fetch other users recipient');

    const predicate = mapQueryToFindOptions<Recipient>(restQuery);
    const recipients = await this.rep.find({
      ...predicate,
      where: { receiverId, sender: { username: Like(senderUsername) }, letter: { subject: Like(letterSubject) } },
      // relations: { sender: true, letter: true },
      order: { id: 'DESC' },
    });

    // const query = this.rep.createQueryBuilder('r').innerJoin('r.sender', 'u', 'u.username');
    return plainToInstance(RecipientDto, recipients);
  }
}
