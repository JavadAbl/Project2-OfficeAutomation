import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { DepartmentCreateRequest } from '../contract/request/department-create.request';
import { DepartmentService } from '../service/department.service';
import { DepartmentRoleCreateRequest } from '../contract/request/department-role-create.request';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { DepartmentsDto } from '../contract/dto/departments.dto';
import { DepartmentDto } from '../contract/dto/department.dto';
import { DepartmentRoleDto } from '../contract/dto/department-role.dto';
import { DepartmentRoleService } from '../service/department-role.service';

@Controller('Identity/Department')
export class DepartmentController {
  constructor(
    private readonly service: DepartmentService,
    private readonly roleService: DepartmentRoleService,
  ) {}

  @Get()
  getDepartments(
    @Query() query: GetManyQueryRequest,
  ): Promise<DepartmentsDto[]> {
    return this.service.getDtoMany(DepartmentsDto, query, ['name']);
  }

  @Get('Role')
  getDepartmentRoles(
    @Query() query: GetManyQueryRequest,
  ): Promise<DepartmentRoleDto[]> {
    return this.roleService.getDtoMany(DepartmentRoleDto, query, ['name']);
  }

  @Get(':id')
  getDepartmentById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepartmentDto> {
    return this.service.getDtoById(DepartmentDto, id, {
      relations: { departmentRoles: true },
    });
  }

  @Post()
  createDepartment(@Body() payload: DepartmentCreateRequest): Promise<number> {
    return this.service.createDepartment(payload);
  }

  @Post(':id/Role')
  createDepartmentRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: DepartmentRoleCreateRequest,
  ): Promise<number> {
    return this.service.createDepartmentRole(id, payload);
  }
}
