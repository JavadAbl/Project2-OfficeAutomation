import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthLoginRequest } from '../contract/request/auth-login.request';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/identity/user/service/user.service';
import { HashingProvider } from '../providers/hashing.provider';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/identity/user/contract/dto/user.dto';
import { AuthDto } from '../contract/dto/auth.dto';
import { AccessTokenPayload } from '../contract/interface/access-token-payload.interface';
import { AuthRole } from '../enum/auth-role.enum';
import { enumToObject } from 'src/common/utils/app.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async login(payload: AuthLoginRequest): Promise<AuthDto> {
    const { password, username } = payload;
    const user = await this.userService.getBy('username', username, { relations: { departmentRole: true } });
    if (!user) throw new NotFoundException('User with this id not found');

    const isPasswordMatch = await this.hashingProvider.comparePassword(password, user.password);

    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    const accessTokenPayload: AccessTokenPayload = {
      userId: user.id,
      authRoleId: user?.departmentRole?.authRole,
      departmentRoleId: user?.departmentRoleId,
    };
    const accessToken = await this.jwtService.signAsync(accessTokenPayload);

    const userDto = plainToInstance(UserDto, user);
    return { user: userDto, accessToken };
  }

  getAuthRoles(): Record<string, any> {
    return enumToObject(AuthRole);
  }
}
