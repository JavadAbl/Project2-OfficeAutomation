import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApprovalWorkflowRole } from '../entity/approval-workflow-role.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { ApprovalWorkflowRoleCreateRequest } from '../contract/request/approval-workflow-role-create.request';
import { DepartmentRoleService } from 'src/identity/service/department-role.service';

@Injectable()
export class ApprovalWorkflowRoleService extends BaseService<ApprovalWorkflowRole> {
  constructor(
    @InjectRepository(ApprovalWorkflowRole)
    rep: Repository<ApprovalWorkflowRole>,

    private readonly departmentRoleService: DepartmentRoleService,
  ) {
    super(rep, 'ApprovalWorkflowRole');
  }

  async create(payload: ApprovalWorkflowRoleCreateRequest): Promise<number> {
    const { departmentRoleId } = payload;
    await this.departmentRoleService.checkExistsById(departmentRoleId);
    let workflowRole = this.rep.create();
    workflowRole = await this.rep.save(workflowRole);

    return workflowRole.id;
  }
}
