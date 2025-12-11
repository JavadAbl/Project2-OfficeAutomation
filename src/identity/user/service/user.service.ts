import { Injectable } from '@nestjs/common';
import { UserDto } from '../contract/dto/user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/service/base.service';
import { DepartmentService } from '../../department/service/department.service';
import { User } from '../entity/user.entity';
import { UserSetDepartmentRequest } from '../contract/request/user-set-department.request';
import { UserCreateRequest } from '../contract/request/user-create.request';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { UserSetRoleRequest } from '../contract/request/user-set-role.request';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    rep: Repository<User>,

    private readonly departmentService: DepartmentService,
    private readonly hashingProvider: HashingProvider,
  ) {
    super(rep, 'User');
  }

  async createUser(payload: UserCreateRequest): Promise<UserDto> {
    const { departmentId, password, username } = payload;
    await this.checkConflictBy('username', username);

    const passwordHash = await this.hashingProvider.hashPassword(password);

    if (departmentId)
      await this.departmentService.checkExistsById(departmentId);

    const user = this.rep.create({
      ...payload,
      password: passwordHash,
      departmentId,
    });
    const savedUser = await this.rep.save(user);
    const dto = plainToInstance(UserDto, savedUser);
    return dto;
  }

  async setDepartment(
    id: number,
    payload: UserSetDepartmentRequest,
  ): Promise<void> {
    const { departmentId } = payload;
    const user = await this.getAndCheckExistsById(id);

    await this.departmentService.checkExistsById(departmentId);

    user.departmentId = departmentId;
    await this.rep.update({ id }, { departmentId });
  }

  async setRole(id: number, payload: UserSetRoleRequest): Promise<void> {
    /*  const { roleId } = payload;
    const user = await this.getAndCheckExistsById(id);

    await this.departmentService.checkExistsById(departmentId);

    user.departmentId = departmentId;
    await this.rep.update({ id }, { departmentId }); */
  }
}
