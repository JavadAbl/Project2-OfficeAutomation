import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { LetterApproval } from '../entity/letter-approval.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessTokenPayload } from 'src/auth/contract/interface/access-token-payload.interface';
import { letterApprovalDto } from '../contract/dto/letter-approval.dto';

@Injectable()
export class LetterApprovalService extends BaseService<LetterApproval> {
  constructor(@InjectRepository(LetterApproval) rep: Repository<LetterApproval>) {
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
  }

  getLetterApprovals(tokenPayload: AccessTokenPayload): Promise<letterApprovalDto[]> {
    //Todo
    const { departmentRoleId } = tokenPayload;
    return this.rep.findBy({ departmentRoleId });
  }
}
