import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { DepartmentRoleService } from 'src/identity/service/department-role.service';
import { WorkflowCreateRequest } from '../contract/request/workflow-create.request';
import { Workflow } from '../entity/workflow.entity';

@Injectable()
export class WorkflowService extends BaseService<Workflow> {
  constructor(
    @InjectRepository(Workflow)
    rep: Repository<Workflow>,

    private readonly departmentRoleService: DepartmentRoleService,
  ) {
    super(rep, 'Workflow');
  }

  async create(payload: WorkflowCreateRequest): Promise<number> {
    const { departmentRoleId } = payload;
    await this.departmentRoleService.checkExistsById(departmentRoleId);
    let workflow = this.rep.create();
    workflow = await this.rep.save(workflow);

    return workflow.id;
  }
}
