import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Recipient } from '../entity/recipient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientCreateRequest } from '../contract/request/recipient-create.request';
import { AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { UserService } from 'src/identity/user/service/user.service';
import { LetterService } from 'src/letter/service/letter.service';
import { LetterStatus } from 'src/letter/contract/enum/letter-status.enum';
import { RecipientReceiverDto } from '../contract/dto/recipient-receiver.dto';
import { RecipientGetByReceiverRequest } from '../contract/request/recipient-get-by-receiver.request';
import { buildLike, mapQueryToFindOptions } from 'src/common/utils/typeorm.utils';
import { plainToInstance } from 'class-transformer';
import { RecipientGetBySenderRequest } from '../contract/request/recipient-get-by-sender.request';
import { RecipientSenderDto } from '../contract/dto/recipient-sender.dto';

@Injectable()
export class RecipientService extends BaseService<Recipient> {
  constructor(
    @InjectRepository(Recipient) rep: Repository<Recipient>,

    private readonly userService: UserService,

    @Inject(forwardRef(() => LetterService))
    private readonly letterService: LetterService,
  ) {
    super(rep, Recipient.name);
  }

  async createRecipient(payload: RecipientCreateRequest, tokenPayload: AccessTokenPayload): Promise<void> {
    const { receiverIds, letterId } = payload;
    const { userId: senderId } = tokenPayload;

    const letter = await this.letterService.getAndCheckExistsById(letterId);

    if (letter.creatorUserId !== senderId) throw new ForbiddenException('this user not owns the letter');
    if ([LetterStatus.pending, LetterStatus.rejected].includes(letter.status))
      throw new BadRequestException(`The letter status is ${LetterStatus[letter.status]}`);

    for (const receiverId of receiverIds) {
      await this.userService.checkExistsById(receiverId);

      if (receiverId === senderId) throw new BadRequestException('Cannot send letter to yourself');

      const recipient = this.rep.create({ letterId, receiverId, senderId });

      await this.rep.save(recipient);
    }

    await this.letterService.updatePartial(letterId, { status: LetterStatus.sent });
  }

  async getRecipientsByReceiver(query: RecipientGetByReceiverRequest, tokenPayload: AccessTokenPayload): Promise<RecipientReceiverDto[]> {
    const { receiverId, senderUsername, letterSubject, ...restQuery } = query;

    if (receiverId !== tokenPayload.userId) throw new ForbiddenException('Cant fetch other users recipient');

    const predicate = mapQueryToFindOptions<Recipient>(restQuery);
    const recipients = await this.rep.find({
      ...predicate,
      where: { receiverId, sender: { username: buildLike(senderUsername) }, letter: { subject: buildLike(letterSubject) } },
      relations: { sender: true, letter: true },
      select: { sender: { username: true, id: true }, letter: { subject: true, id: true } },
      order: { id: 'DESC' },
    });

    return plainToInstance(RecipientReceiverDto, recipients);
  }

  async getRecipientsBySender(query: RecipientGetBySenderRequest, tokenPayload: AccessTokenPayload): Promise<RecipientSenderDto[]> {
    const { senderId, receiverUsername, letterSubject, ...restQuery } = query;

    if (senderId !== tokenPayload.userId) throw new ForbiddenException('Cant fetch other users recipient');

    const predicate = mapQueryToFindOptions<Recipient>(restQuery);
    const recipients = await this.rep.find({
      ...predicate,
      where: { senderId, sender: { username: buildLike(receiverUsername) }, letter: { subject: buildLike(letterSubject) } },
      relations: { receiver: true, letter: true },
      select: { receiver: { username: true, id: true }, letter: { subject: true, id: true } },
      order: { id: 'DESC' },
    });

    return plainToInstance(RecipientSenderDto, recipients);
  }
}
