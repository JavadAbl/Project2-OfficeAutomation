import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { OrganizationCreateRequest } from './contract/request/organization-create.request';
import { OrganizationDto } from './contract/dto/organization.dto';
import { UserCreateRequest } from './contract/request/user-create.request';
import { UserDto } from './contract/dto/user.dto';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';

@Controller('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('User')
  createUserEndpoint(@Body() payload: UserCreateRequest): Promise<UserDto> {
    return this.authService.createUser(payload);
  }

  @Get('User')
  getUsersEndpoint(@Query() payload: GetManyQueryRequest): Promise<UserDto[]> {
    return this.authService.getUsers(payload);
  }

  @Get('User/:id')
  getUserByIdEndpoint(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.authService.getUserById(id);
  }

  @Get('Organization')
  getOrganizationsEndpoint(): Promise<OrganizationDto[]> {
    return this.authService.getOrganizations();
  }

  @Get('Organization/:id')
  getOrganizationByIdEndpoint(
    @Param('id') id: string,
  ): Promise<OrganizationDto> {
    return this.authService.getOrganizationById(id);
  }

  @Post('Organization')
  createOrganizationEndpoint(
    @Body() payload: OrganizationCreateRequest,
  ): Promise<OrganizationDto> {
    return this.authService.createOrganization(payload);
  }
}
