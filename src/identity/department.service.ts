import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entity/department.entity';
import { DepartmentDto } from './contract/dto/department.dto';
import { DepartmentCreateRequest } from './contract/request/department-create.request';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly repDep: Repository<Department>,
  ) {}

  async createDepartment(
    payload: DepartmentCreateRequest,
  ): Promise<DepartmentDto> {
    const exists = await this.repDep.findOne({
      where: { name: payload.name },
    });
    if (exists) throw new ConflictException('Department name already exists');

    const org = this.repDep.create(payload);
    const savedOrg = await this.repDep.save(org);
    const dto = plainToInstance(DepartmentDto, savedOrg);
    return dto;
  }

  async getDepartments(): Promise<DepartmentDto[]> {
    const deps = await this.repDep.find();
    return deps.map((val) => plainToInstance(DepartmentDto, val));
  }

  async getDepartmentById(id: number): Promise<DepartmentDto> {
    const dep = await this.repDep.findOneBy({ id });
    if (!dep) throw new NotFoundException();
    return plainToInstance(DepartmentDto, dep);
  }
}
