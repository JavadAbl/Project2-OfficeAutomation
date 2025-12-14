import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Letter } from '../entity/letter.entity';
import { Repository } from 'typeorm';
import { generateLetterNumber, getFileNameAndExt } from 'src/common/utils/app.utils';
import { plainToInstance } from 'class-transformer';
import { letterDto } from '../contract/dto/letter.dto';
import { BaseService } from 'src/common/service/base.service';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { Attachment } from '../entity/attachment.entity';
import { LetterCreateRequest } from '../contract/request/letter-create.request';
import { TemplateService } from '../template/service/template.service';
import { AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { RecipientService } from '../recipient/service/recipient.service';
import { LetterStatus } from '../contract/enum/letter-status.enum';

@Injectable()
export class LetterService extends BaseService<Letter> {
  /*   getAndCheckExistsById: typeof CommonService.getAndCheckExistsById =
    CommonService.getAndCheckExistsById.bind(CommonService); */

  constructor(
    @InjectRepository(Letter) rep: Repository<Letter>,

    @InjectRepository(Attachment)
    private readonly repAttachment: Repository<Attachment>,

    private readonly templateService: TemplateService,

    @Inject(forwardRef(() => RecipientService))
    private readonly recipientService: RecipientService,
  ) {
    super(rep, Letter.name);
  }

  async create(payload: LetterCreateRequest, tokenPayload: AccessTokenPayload) {
    const { templateId } = payload;
    const { userId } = tokenPayload;

    await this.templateService.checkExistsById(templateId);

    const letterNumber = generateLetterNumber();

    let newLetter = this.rep.create({ ...payload, number: letterNumber, creatorUserId: userId });
    newLetter = await this.rep.save(newLetter);

    return plainToInstance(letterDto, newLetter);
  }

  async addAttachments(id: number, files: Express.Multer.File[]) {
    await this.getAndCheckExistsById(id);
    if (!files || !files.length) throw new BadRequestException('Invalid files');

    const publicDir = join(process.cwd(), 'public', 'attachments');
    await mkdir(publicDir, { recursive: true });

    const attachments = await Promise.all(
      files.map(async (file) => {
        const [name, ext] = getFileNameAndExt(file.originalname);
        const fileName = `${name}-${id}.${ext}`;
        const filePath = join(publicDir, fileName);

        await writeFile(filePath, file.buffer);

        const attachment = this.repAttachment.create({ letterId: id, fileName });

        const existingAttachment = await this.repAttachment.findOneBy({ fileName });
        if (existingAttachment) {
          await this.repAttachment.delete(existingAttachment.id);
        }

        return attachment;
      }),
    );

    await this.repAttachment.save(attachments);
  }

  async getLetterById(id: number, tokenPayload: AccessTokenPayload): Promise<letterDto> {
    const { userId } = tokenPayload;

    const letter = await this.getAndCheckExistsById(id);
    if (letter.creatorUserId === userId) return plainToInstance(letterDto, letter);
    if (letter.status !== LetterStatus.sent) throw new ForbiddenException('Access this letter is not permit');

    const recipient = await this.recipientService.getBy('letterId', id, {
      where: [
        // (letterId = :letterId AND receiverId = :receiverId)
        { letterId: id, receiverId: userId },
        // OR (letterId = :letterId AND senderId = :senderId)
        { letterId: id, senderId: userId },
      ],
    });

    if (!recipient) throw new ForbiddenException('Access this letter is not permit');
    if (!recipient.IsSeen) {
      const temp = await this.recipientService.updatePartial(recipient.id, { IsSeen: true });
      console.log(temp);
    }

    return plainToInstance(letterDto, letter);
  }
}
