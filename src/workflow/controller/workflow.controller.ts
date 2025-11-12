import { Body, Controller, Post } from '@nestjs/common';
import { WorkflowService } from '../service/workflow.service';
import { WorkflowCreateRequest } from '../contract/request/workflow-create.request';

@Controller('Workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create(@Body() payload: WorkflowCreateRequest) {
    return this.workflowService.create(payload);
  }
}
