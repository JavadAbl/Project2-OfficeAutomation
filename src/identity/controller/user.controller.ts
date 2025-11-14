import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserCreateRequest } from '../contract/request/user-create.request';
import { UserDto } from '../contract/dto/user.dto';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { UserService } from '../service/user.service';

@Controller('Identity/User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() payload: UserCreateRequest): Promise<UserDto> {
    return this.userService.createUser(payload);
  }

  @Get('User')
  getUsers(@Query() query: GetManyQueryRequest): Promise<UserDto[]> {
    return this.userService.getDtoMany(UserDto, query, ['username']);
  }

  @Get('User/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.getDtoById(UserDto, id);
  }
}
