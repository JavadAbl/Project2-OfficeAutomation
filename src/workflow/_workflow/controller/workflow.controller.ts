import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { WorkflowService } from '../service/workflow.service';
import { WorkflowCreateRequest } from '../contract/request/workflow-create.request';
import { GetManyQueryRequest } from 'src/common/contract/request/get-many-query.request';
import { WorkflowDto } from '../contract/dto/workflow.dto';
import { WorkflowsDto } from '../contract/dto/workflows.dto';
import { WorkflowSetDepartmentRolesRequest } from '../contract/request/workflow-set-department-roles.request';

@Controller('Workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create(@Body() payload: WorkflowCreateRequest): Promise<number> {
    return this.workflowService.create(payload);
  }

  @Post(':id/SetDepartmentRoles')
  setWorkflowDepartmentRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: WorkflowSetDepartmentRolesRequest,
  ): Promise<void> {
    return this.workflowService.setDepartmentRoles(id, payload);
  }

  @Get()
  getWorkflows(@Query() query: GetManyQueryRequest): Promise<WorkflowsDto[]> {
    return this.workflowService.getDtoMany(WorkflowsDto, query, ['name']);
  }

  @Get(':id')
  getWorkflowById(@Param('id', ParseIntPipe) id: number): Promise<WorkflowDto> {
    return this.workflowService.getDtoById(WorkflowDto, id, { relations: { departmentRoles: true } });
  }
}
