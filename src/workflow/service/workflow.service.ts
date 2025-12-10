import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { WorkflowCreateRequest } from '../contract/request/workflow-create.request';
import { Workflow } from '../entity/workflow.entity';
import { WorkflowSetTemplatesRequest } from '../contract/request/workflow-set-templates.request';
import { TemplateService } from 'src/letter/service/template.service';
import { Template } from 'src/letter/entity/template.entity';
import { WorkflowSetDepartmentRolesRequest } from '../contract/request/workflow-set-department-roles.request';
import { DepartmentRole } from 'src/identity/department/entity/department-role.entity';
import { DepartmentRoleService } from 'src/identity/department/department-role.service';

@Injectable()
export class WorkflowService extends BaseService<Workflow> {
  constructor(
    @InjectRepository(Workflow)
    rep: Repository<Workflow>,

    private readonly templateService: TemplateService,
    private readonly departmentRoleService: DepartmentRoleService,
  ) {
    super(rep, 'Workflow');
  }

  async create(payload: WorkflowCreateRequest): Promise<number> {
    const { name } = payload;
    await this.checkConflictBy('name', name);
    let workflow = this.rep.create(payload);
    workflow = await this.rep.save(workflow);

    return workflow.id;
  }

  async setTemplates(
    id: number,
    payload: WorkflowSetTemplatesRequest,
  ): Promise<void> {
    const { templateIds } = payload;
    const workflow = await this.getAndCheckExistsById(id);

    const templates: Template[] = [];
    for (const templateId of templateIds) {
      await this.templateService.checkExistsById(templateId);
      const template = new Template();
      template.id = templateId;
      templates.push(template);
    }

    workflow.templates = templates;
    await this.rep.save(workflow);
  }

  async setDepartmentRoles(
    id: number,
    payload: WorkflowSetDepartmentRolesRequest,
  ): Promise<void> {
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
