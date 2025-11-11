import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entity/department.entity';
import { DepartmentDto } from '../contract/dto/department.dto';
import { DepartmentCreateRequest } from '../contract/request/department-create.request';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/service/base.service';
import { DepartmentRoleCreateRequest } from '../contract/request/department-role-create.request';
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

  async createDepartment(
    payload: DepartmentCreateRequest,
  ): Promise<DepartmentDto> {
    const { name } = payload;
    await this.checkConflictBy('name', name);

    let dep = this.rep.create(payload);
    dep = await this.rep.save(dep);
    return plainToInstance(DepartmentDto, dep);
  }

  async getDepartments(): Promise<DepartmentDto[]> {
    const deps = await this.rep.find();
    return deps.map((val) => plainToInstance(DepartmentDto, val));
  }

  async getDepartmentById(id: number): Promise<DepartmentDto> {
    const dep = await this.rep.findOneBy({ id });
    if (!dep) throw new NotFoundException();
    return plainToInstance(DepartmentDto, dep);
  }

  async createDepartmentRole(id: number, payload: DepartmentRoleCreateRequest) {
    await this.checkExistsById(id);
    return this.departmentRoleService.createRole(id, payload);
  }
}
