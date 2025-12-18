import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { LetterApproval } from '../entity/letter-approval.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from 'src/auth/_auth/contract/interface/access-token-payload.interface';
import { letterApprovalDto } from '../contract/dto/letter-approval.dto';
import { plainToInstance } from 'class-transformer';
import { LetterService } from './letter.service';
import { LetterStatus } from '../contract/enum/letter-status.enum';

@Injectable()
export class LetterApprovalService extends BaseService<LetterApproval> {
  constructor(
    @InjectRepository(LetterApproval) rep: Repository<LetterApproval>,

    @Inject(forwardRef(() => LetterService))
    private readonly letterService: LetterService,
  ) {
    super(rep, LetterApproval.name);
  }

  create(letterId: number, departmentRoleId: number): Promise<LetterApproval> {
    const letterApproval = this.rep.create({ letterId, departmentRoleId });
    return this.rep.save(letterApproval);
  }

  async confirmLetterApproval(
    letterId: number,
    departmentRoleId: number,
    tokenPayload: AccessTokenPayload,
  ): Promise<void> {
    const { departmentRoleId: tokenDepartmentRoleId } = tokenPayload;

    if (departmentRoleId !== tokenDepartmentRoleId) throw new ForbiddenException('Access Denied');

    const letterApprovals = await this.rep.findBy({ letterId, departmentRoleId });
    for (const la of letterApprovals) {
      await this.rep.update(la, { isActive: false });
    }

    const allLetterApprovals = await this.rep.findBy({ letterId });
    const isLetterCanSend = allLetterApprovals.every((item) => !item.isActive && !item.isRejected);
    if (isLetterCanSend) await this.letterService.updatePartial(letterId, { status: LetterStatus.sent });
  }

  async rejectLetterApproval(
    letterId: number,
    departmentRoleId: number,
    tokenPayload: AccessTokenPayload,
  ): Promise<void> {
    const { departmentRoleId: tokenDepartmentRoleId } = tokenPayload;

    if (departmentRoleId !== tokenDepartmentRoleId) throw new ForbiddenException('Access Denied');

    const letterApprovals = await this.rep.findBy({ letterId, departmentRoleId });
    for (const la of letterApprovals) {
      await this.rep.update(la, { isActive: false, isRejected: true });
    }

    await this.letterService.updatePartial(letterId, { status: LetterStatus.rejected });
  }

  async getActiveLetterApprovals(tokenPayload: AccessTokenPayload): Promise<letterApprovalDto[]> {
    const { departmentRoleId } = tokenPayload;

    const lps = await this.rep.find({
      where: { departmentRoleId, isActive: true },
      relations: { letter: { creatorUser: true } },
      select: { letter: { id: true, subject: true, creatorUser: { username: true } } },
    });
    return plainToInstance(letterApprovalDto, lps);
  }
}
