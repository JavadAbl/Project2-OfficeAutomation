import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCreateRequest } from '../contract/request/user-create.request';
import { UserDto } from '../contract/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtils } from 'src/common/utils/crypto.utils';
import { Department } from '../entity/department.entity';
import { plainToInstance } from 'class-transformer';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { TypeormUtils } from 'src/common/utils/typeorm.utils';
import { BaseService } from 'src/common/service/base.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    rep: Repository<User>,

    @InjectRepository(Department)
    private readonly repDep: Repository<Department>,
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

    if (departmentId) await this.checkExistsById(departmentId);

    const user = this.rep.create({
      ...payload,
      password: passwordHash,
      departmentId,
    });
    const savedUser = await this.rep.save(user);
    const dto = plainToInstance(UserDto, savedUser);
    return dto;
  }

  async getUsers(payload: GetManyQueryRequest): Promise<UserDto[]> {
    const params = TypeormUtils.mapQueryToFindOptions<User>(payload);
    const users = await this.rep.find(params);
    return users.map((val) => plainToInstance(UserDto, val));
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.rep.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }
}
