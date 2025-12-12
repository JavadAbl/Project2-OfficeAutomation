import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepartmentRole } from '../entity/department-role.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/common/service/base.service';
import { DepartmentRoleCreateRequest } from '../contract/request/department-role-create.request';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class DepartmentRoleService extends BaseService<DepartmentRole> {
  constructor(
    @InjectRepository(DepartmentRole)
    rep: Repository<DepartmentRole>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super(rep, DepartmentRole.name);
  }

  async create(departmentId: number, payload: DepartmentRoleCreateRequest) {
    const { name, authRoleId } = payload;
    await this.checkConflictBy('name', name);

    const isAuthRoleExists =
      await this.authService.checkExistsAuthRoleById(authRoleId);

    if (!isAuthRoleExists)
      throw new BadRequestException('AuthRoleId is not exists');

    let role = this.rep.create({ ...payload, departmentId });
    role = await this.rep.save(role);

    return role.id;
  }
}
