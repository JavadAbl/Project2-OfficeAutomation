import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginRequest } from '../contract/request/auth-login.request';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/identity/user/service/user.service';
import { HashingProvider } from '../providers/hashing.provider';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/identity/user/contract/dto/user.dto';
import { AuthDto } from '../contract/dto/auth.dto';
import { AuthCreateRoleRequest } from '../contract/request/auth-create-role.request';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRole } from '../entity/auth-role';
import { Repository } from 'typeorm';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { mapQueryToFindOptions } from 'src/common/utils/typeorm.utils';
import { AuthRoleDto } from '../contract/dto/auth-role.dto';
import { AccessTokenPayload } from '../contract/interface/access-token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRole)
    private readonly authRoleRep: Repository<AuthRole>,

    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async login(payload: AuthLoginRequest): Promise<AuthDto> {
    const { password, username } = payload;
    const user = await this.userService.getBy('username', username, {
      relations: { departmentRole: true },
    });
    if (!user) throw new NotFoundException('User with this id not found');

    const isPasswordMatch = await this.hashingProvider.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      authRoleId: user?.departmentRole?.authRoleId,
    };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload);

    const userDto = plainToInstance(UserDto, user);
    return { user: userDto, accessToken };
  }

  async createAuthRole(payload: AuthCreateRoleRequest): Promise<number> {
    const { name } = payload;
    const isRoleExists = await this.authRoleRep.existsBy({ name });

    if (isRoleExists) throw new ConflictException('Role with this name exists');

    let authRole = this.authRoleRep.create({ name });
    authRole = await this.authRoleRep.save(authRole);

    return authRole.id;
  }

  getAuthRoles(query: GetManyQueryRequest): Promise<AuthRoleDto[]> {
    const predicates = mapQueryToFindOptions<AuthRole>(query, ['name']);
    return this.authRoleRep.find(predicates);
  }

  checkExistsAuthRoleById(id: number): Promise<boolean> {
    return this.authRoleRep.existsBy({ id });
  }
}
