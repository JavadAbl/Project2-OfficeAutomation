import { ConflictException, Injectable } from '@nestjs/common';
import { UserCreateRequest } from '../contract/request/user-create.request';
import { UserDto } from '../contract/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtils } from 'src/common/utils/crypto.utils';
import { plainToInstance } from 'class-transformer';
import { BaseService } from 'src/common/service/base.service';
import { UserSetDepartmentRequest } from '../contract/request/user-set-department.request';
import { DepartmentService } from './department.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    rep: Repository<User>,

    private readonly departmentService: DepartmentService,
  ) {
    super(rep, 'User');
  }

  async createUser(payload: UserCreateRequest): Promise<UserDto> {
    const { departmentId, password, username } = payload;
    const exists = await this.rep.findOne({
      where: { username: username },
    });
    if (exists) throw new ConflictException('Username already exists');
    const passwordHash = await CryptoUtils.hashPassword(password);

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
}
