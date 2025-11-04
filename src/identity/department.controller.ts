import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DepartmentDto } from './contract/dto/department.dto';
import { DepartmentCreateRequest } from './contract/request/department-create.request';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
  constructor(private readonly depService: DepartmentService) {}

  @Get('Department')
  getDepartmentsEndpoint(): Promise<DepartmentDto[]> {
    return this.depService.getDepartments();
  }

  @Get('Department/:id')
  getDepartmentByIdEndpoint(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepartmentDto> {
    return this.depService.getDepartmentById(id);
  }

  @Post('Department')
  createDepartmentEndpoint(
    @Body() payload: DepartmentCreateRequest,
  ): Promise<DepartmentDto> {
    return this.depService.createDepartment(payload);
  }
}
