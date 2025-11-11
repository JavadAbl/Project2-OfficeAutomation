import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DepartmentDto } from '../contract/dto/department.dto';
import { DepartmentCreateRequest } from '../contract/request/department-create.request';
import { DepartmentService } from '../service/department.service';
import { DepartmentRoleCreateRequest } from '../contract/request/department-role-create.request';

@Controller('Identity/Department')
export class DepartmentController {
  constructor(private readonly service: DepartmentService) {}

  @Get()
  getDepartmentsEndpoint(): Promise<DepartmentDto[]> {
    return this.service.getDepartments();
  }

  @Get(':id')
  getDepartmentByIdEndpoint(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepartmentDto> {
    return this.service.getDepartmentById(id);
  }

  @Post()
  createDepartmentEndpoint(
    @Body() payload: DepartmentCreateRequest,
  ): Promise<DepartmentDto> {
    return this.service.createDepartment(payload);
  }

  @Post(':id/Role')
  createDepartmentRoleEndpoint(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: DepartmentRoleCreateRequest,
  ): Promise<number> {
    return this.service.createDepartmentRole(id, payload);
  }
}
