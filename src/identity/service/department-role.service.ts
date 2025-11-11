import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentRole } from '../entity/department-role';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { DepartmentRoleCreateRequest } from '../contract/request/department-role-create.request';

@Injectable()
export class DepartmentRoleService extends BaseService<DepartmentRole> {
  constructor(
    @InjectRepository(DepartmentRole)
    rep: Repository<DepartmentRole>,
  ) {
    super(rep, 'Department Role');
  }

  async createRole(id: number, payload: DepartmentRoleCreateRequest) {
    const { name } = payload;
    await this.checkConflictBy('name', name);

    let role = this.rep.create(payload);
    role = await this.rep.save(role);

    return role.id;
  }
}
