import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entity/department.entity';
import { DepartmentCreateRequest } from '../contract/request/department-create.request';
import { BaseService } from 'src/common/service/base.service';
import { DepartmentRoleCreateRequest } from '../contract/request/departmentRole-create.request';
import { DepartmentRoleService } from './department-role.service';

@Injectable()
export class DepartmentService extends BaseService<Department> {
  constructor(
    @InjectRepository(Department)
    rep: Repository<Department>,

    private readonly departmentRoleService: DepartmentRoleService,
  ) {
    super(rep, 'Department');
  }

  async createDepartment(payload: DepartmentCreateRequest): Promise<number> {
    const { name } = payload;
    await this.checkConflictBy('name', name);

    let dep = this.rep.create(payload);
    dep = await this.rep.save(dep);
    return dep.id;
  }

  async createDepartmentRole(
    id: number,
    payload: DepartmentRoleCreateRequest,
  ): Promise<number> {
    await this.checkExistsById(id);
    return this.departmentRoleService.create(id, payload);
  }
}
