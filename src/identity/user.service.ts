import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserCreateRequest } from './contract/request/user-create.request';
import { UserDto } from './contract/dto/user.dto';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoUtils } from 'src/common/utils/crypto.utils';
import { Department } from './entity/department.entity';
import { plainToInstance } from 'class-transformer';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { TypeormUtils } from 'src/common/utils/typeorm.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repUser: Repository<User>,

    @InjectRepository(Department)
    private readonly repDep: Repository<Department>,
  ) {}

  async createUser(payload: UserCreateRequest): Promise<UserDto> {
    const exists = await this.repUser.findOne({
      where: { username: payload.username },
    });
    if (exists) throw new ConflictException('Username already exists');
    const passwordHash = await CryptoUtils.hashPassword(payload.password);

    const dep = await this.repDep.findOneBy({
      id: payload.departmentId,
    });

    if (!dep) throw new BadRequestException('dep not found');

    const user = this.repUser.create({
      ...payload,
      passwordHash,
      department: dep,
    });
    const savedUser = await this.repUser.save(user);
    const dto = plainToInstance(UserDto, savedUser);
    return dto;
  }

  async getUsers(payload: GetManyQueryRequest): Promise<UserDto[]> {
    const params = TypeormUtils.mapQueryToFindOptions<User>(payload);
    const users = await this.repUser.find(params);
    return users.map((val) => plainToInstance(UserDto, val));
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.repUser.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return plainToInstance(UserDto, user);
  }
}
