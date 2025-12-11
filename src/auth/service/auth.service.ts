import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginRequest } from '../contract/request/auth-login.request';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/identity/user/service/user.service';
import { HashingProvider } from '../providers/hashing.provider';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/identity/user/contract/dto/user.dto';
import { AuthDto } from '../contract/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async login(payload: AuthLoginRequest): Promise<AuthDto> {
    const { password, username } = payload;
    const user = await this.userService.getAndCheckExistsBy(
      'username',
      username,
    );

    const isPasswordMatch = await this.hashingProvider.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordMatch) throw new UnauthorizedException('Invalid password');

    const accessToken = await this.jwtService.signAsync({ userId: user.id });

    const userDto = plainToInstance(UserDto, user);
    return { user: userDto, accessToken };
  }
}
