import { Injectable } from '@nestjs/common';
import { UserDto } from '../contract/dto/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/service/base.service';
import { User } from '../entity/user.entity';
import { UserSetDepartmentRoleRequest } from '../contract/request/user-set-department-role.request';
import { UserCreateRequest } from '../contract/request/user-create.request';
import { HashingProvider } from 'src/auth/_auth/providers/hashing.provider';
import { DepartmentRoleService } from 'src/identity/department/_department/service/department-role.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    rep: Repository<User>,

    private readonly departmentRoleService: DepartmentRoleService,
    private readonly hashingProvider: HashingProvider,
  ) {
    super(rep, 'User');
  }

  async createUser(payload: UserCreateRequest): Promise<UserDto> {
    const { departmentRoleId, password, username } = payload;
    await this.checkConflictBy('username', username);

    const passwordHash = await this.hashingProvider.hashPassword(password);

    if (departmentRoleId) await this.departmentRoleService.checkExistsById(departmentRoleId);

    const user = this.rep.create({ ...payload, password: passwordHash, departmentRoleId });
    const savedUser = await this.rep.save(user);
    const dto = plainToInstance(UserDto, savedUser);
    return dto;
  }

  async setDepartmentRole(id: number, payload: UserSetDepartmentRoleRequest): Promise<void> {
    const { departmentRoleId } = payload;
    const user = await this.getAndCheckExistsById(id);

    await this.departmentRoleService.checkExistsById(departmentRoleId);

    user.departmentRoleId = departmentRoleId;
    await this.rep.update({ id }, { departmentRoleId });
  }
}
