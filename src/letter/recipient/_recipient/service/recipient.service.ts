import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Recipient } from '../entity/recipient.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipientCreateRequest } from '../contract/request/recipient-create.request';
import { AccessTokenPayload } from 'src/auth/_auth/contract/interface/access-token-payload.interface';
import { UserService } from 'src/identity/user/_user/service/user.service';
import { LetterService } from 'src/letter/_letter/service/letter.service';
import { RecipientReceiverDto } from '../contract/dto/recipient-receiver.dto';
import { RecipientGetByReceiverRequest } from '../contract/request/recipient-get-by-receiver.request';
import { buildLike, mapQueryToFindOptions } from 'src/common/utils/typeorm.utils';
import { plainToInstance } from 'class-transformer';
import { RecipientGetBySenderRequest } from '../contract/request/recipient-get-by-sender.request';
import { RecipientSenderDto } from '../contract/dto/recipient-sender.dto';
import { LetterStatus } from 'src/letter/_letter/contract/enum/letter-status.enum';
import { Letter } from 'src/letter/_letter/entity/letter.entity';
import { TemplateService } from 'src/letter/template/_template/service/template.service';

@Injectable()
export class RecipientService extends BaseService<Recipient> {
  constructor(
    @InjectRepository(Recipient) rep: Repository<Recipient>,

    private readonly userService: UserService,

    private readonly templateService: TemplateService,

    @Inject(forwardRef(() => LetterService))
    private readonly letterService: LetterService,
  ) {
    super(rep, Recipient.name);
  }

  async createRecipient(payload: RecipientCreateRequest, tokenPayload: AccessTokenPayload): Promise<void> {
    const { receiverIds, letterId } = payload;
    const { userId: senderId } = tokenPayload;

    const letter = await this.letterService.getAndCheckExistsById(letterId);

    if (letter.hasWorkflow) {
      if (letter.status !== LetterStatus.sent) await this.createWorkflowRecipient(letter, senderId);
    } else {
      const letterRecipients = await this.getMany(undefined, undefined, { where: { letterId } });

      const senderParticipates =
        (letterRecipients || []).some((r) => r.senderId === senderId || r.receiverId === senderId) ||
        letter.creatorUserId === senderId;
      if (!senderParticipates) throw new ForbiddenException('Sender must be part of the letter recipients');

      for (const receiverId of receiverIds) {
        await this.userService.checkExistsById(receiverId);

        if (receiverId === senderId) throw new BadRequestException('Cannot send letter to yourself');

        const recipient = this.rep.create({ letterId, receiverId, senderId });

        await this.rep.save(recipient);
      }
    }
    if (![LetterStatus.pending, LetterStatus.rejected, LetterStatus.sent].includes(letter.status))
      await this.letterService.updatePartial(letterId, { status: LetterStatus.sent });
  }

  private async createWorkflowRecipient(letter: Letter, senderId: number): Promise<void> {
    const template = await this.templateService.getById(letter.templateId, {
      relations: { workflows: true },
      select: { workflows: true },
    });

    const workflows = template?.workflows ?? [];

    for (const wf of workflows) {
      const workflowRoles = wf.departmentRoles;
      for (const dr of workflowRoles) {
        const userWithRole = await this.userService.getBy('departmentRoleId', dr.id, {
          select: { id: true },
        });

        if (userWithRole) {
          const recipient = this.rep.create({ letterId: letter.id, receiverId: userWithRole.id, senderId });
          await this.rep.save(recipient);
        }
      }
    }
  }

  async getRecipientsByReceiver(
    query: RecipientGetByReceiverRequest,
    tokenPayload: AccessTokenPayload,
  ): Promise<RecipientReceiverDto[]> {
    const { receiverId, senderUsername, letterSubject, ...restQuery } = query;

    if (receiverId !== tokenPayload.userId) throw new ForbiddenException('Cant fetch other users recipient');

    const predicate = mapQueryToFindOptions<Recipient>(restQuery);
    const recipients = await this.rep.find({
      ...predicate,
      where: {
        receiverId,
        sender: { username: buildLike(senderUsername) },
        letter: { subject: buildLike(letterSubject) },
      },
      relations: { sender: true, letter: true },
      select: { sender: { username: true, id: true }, letter: { subject: true, id: true, status: true } },
      order: { id: 'DESC' },
    });

    const sendRecipients = recipients.filter((r) => r.letter.status === LetterStatus.sent);

    return plainToInstance(RecipientReceiverDto, sendRecipients);
  }

  async getRecipientsBySender(
    query: RecipientGetBySenderRequest,
    tokenPayload: AccessTokenPayload,
  ): Promise<RecipientSenderDto[]> {
    const { senderId, receiverUsername, letterSubject, ...restQuery } = query;

    if (senderId !== tokenPayload.userId) throw new ForbiddenException('Cant fetch other users recipient');

    const predicate = mapQueryToFindOptions<Recipient>(restQuery);
    const recipients = await this.rep.find({
      ...predicate,
      where: {
        senderId,
        sender: { username: buildLike(receiverUsername) },
        letter: { subject: buildLike(letterSubject) },
      },
      relations: { receiver: true, letter: true },
      select: { receiver: { username: true, id: true }, letter: { subject: true, id: true, status: true } },
      order: { id: 'DESC' },
    });

    return plainToInstance(RecipientSenderDto, recipients);
  }
}
