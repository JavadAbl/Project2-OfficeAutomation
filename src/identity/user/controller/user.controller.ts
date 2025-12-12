import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserCreateRequest } from '../contract/request/user-create.request';
import { UserDto } from '../contract/dto/user.dto';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { UserService } from '../service/user.service';
import { UserSetDepartmentRoleRequest } from '../contract/request/user-set-department-role.request';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from 'src/config/config.type';

@Controller('Identity/User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly config: ConfigService<ConfigType>,
  ) {}

  @Post()
  createUser(@Body() payload: UserCreateRequest): Promise<UserDto> {
    return this.userService.createUser(payload);
  }

  @Get()
  getUsers(@Query() query: GetManyQueryRequest): Promise<UserDto[]> {
    return this.userService.getDtoMany(UserDto, query, ['username']);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.getDtoById(UserDto, id);
  }

  @Patch(':id')
  setUserDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UserSetDepartmentRoleRequest,
  ): Promise<void> {
    return this.userService.setDepartmentRole(id, payload);
  }
}
