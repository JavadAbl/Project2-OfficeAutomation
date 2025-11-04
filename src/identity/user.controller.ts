import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserCreateRequest } from './contract/request/user-create.request';
import { UserDto } from './contract/dto/user.dto';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('User')
  createUserEndpoint(@Body() payload: UserCreateRequest): Promise<UserDto> {
    return this.userService.createUser(payload);
  }

  @Get('User')
  getUsersEndpoint(@Query() payload: GetManyQueryRequest): Promise<UserDto[]> {
    return this.userService.getUsers(payload);
  }

  @Get('User/:id')
  getUserByIdEndpoint(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.getUserById(id);
  }
}
