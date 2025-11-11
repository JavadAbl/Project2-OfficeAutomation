import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApprovalWorkflowRoleCreateRequest } from '../contract/request/approval-workflow-role-create.request';
import { ApprovalWorkflowRoleService } from '../service/approval-workflow-role.service';

@Controller('Workflow/ApprovalWorkflow')
export class ApprovalWorkflowController {
  constructor(
    private readonly approvalWorkflowRoleService: ApprovalWorkflowRoleService,
  ) {}

  @Post('Role')
  createRole(@Body() payload: ApprovalWorkflowRoleCreateRequest) {
    return this.approvalWorkflowRoleService.create(payload);
  }
}
