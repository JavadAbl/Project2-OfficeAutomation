import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { BaseService } from 'src/common/service/base.service';
import { Template } from '../entity/template.entity';
import { TemplateCreateApprovalsRequest } from '../contract/request/template-set-approvals.request';
import { TemplateCreateRequest } from '../contract/request/template-create.request';
import { DepartmentRole } from 'src/identity/department/_department/entity/department-role.entity';
import { DepartmentRoleService } from 'src/identity/department/_department/service/department-role.service';

@Injectable()
export class TemplateService extends BaseService<Template> {
  constructor(
    @InjectRepository(Template)
    rep: Repository<Template>,

    private readonly departmentRoleService: DepartmentRoleService,
  ) {
    super(rep, Template.name);
  }

  async create(payload: TemplateCreateRequest, file: Express.Multer.File): Promise<number> {
    if (!file) throw new BadRequestException('Invalid file');

    await this.checkConflictBy('name', payload.name);

    const fileName = randomUUID() + '.html';
    const template = this.rep.create({ ...payload, fileName });
    const templateEntity = await this.rep.save(template);

    const publicDir = join(process.cwd(), 'public', 'templates');
    await mkdir(publicDir, { recursive: true });
    const filePath = join(publicDir, fileName);
    await writeFile(filePath, file.buffer);

    return templateEntity.id;
  }

  async createDepartmentRoleApprovals(templateId: number, payload: TemplateCreateApprovalsRequest): Promise<void> {
    const { departmentRoleIds } = payload;

    const template = await this.getAndCheckExistsById(templateId);
    const drsList: DepartmentRole[] = [];

    for (const dri of departmentRoleIds) {
      try {
        const drs = await this.departmentRoleService.getAndCheckExistsById(dri);
        drsList.push(drs);
      } catch (error) {
        console.error(error.message, error);
      }
    }
    console.log(template);
    template.approvalDepartmentRoles = drsList;
    await this.rep.save(template);
  }
}
