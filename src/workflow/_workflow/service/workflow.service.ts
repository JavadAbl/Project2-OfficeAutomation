import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { WorkflowCreateRequest } from '../contract/request/workflow-create.request';
import { Workflow } from '../entity/workflow.entity';
import { WorkflowSetDepartmentRolesRequest } from '../contract/request/workflow-set-department-roles.request';
import { DepartmentRole } from 'src/identity/department/_department/entity/department-role.entity';
import { DepartmentRoleService } from 'src/identity/department/_department/service/department-role.service';

@Injectable()
export class WorkflowService extends BaseService<Workflow> {
  constructor(
    @InjectRepository(Workflow)
    rep: Repository<Workflow>,

    private readonly departmentRoleService: DepartmentRoleService,
  ) {
    super(rep, Workflow.name);
  }

  async create(payload: WorkflowCreateRequest): Promise<number> {
    const { name } = payload;
    await this.checkConflictBy('name', name);
    let workflow = this.rep.create(payload);
    workflow = await this.rep.save(workflow);

    return workflow.id;
  }

  async setDepartmentRoles(id: number, payload: WorkflowSetDepartmentRolesRequest): Promise<void> {
    const { departmentRolesIds } = payload;
    const workflow = await this.getAndCheckExistsById(id);

    const DepartmentRoles: DepartmentRole[] = [];
    for (const departmentRoleId of departmentRolesIds) {
      await this.departmentRoleService.checkExistsById(departmentRoleId);
      const departmentRole = new DepartmentRole();
      departmentRole.id = departmentRoleId;
      DepartmentRoles.push(departmentRole);
    }

    workflow.departmentRoles = DepartmentRoles;
    await this.rep.save(workflow);
  }
}
