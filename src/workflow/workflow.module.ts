import { Module } from '@nestjs/common';
import { Approval } from './entity/approval.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalWorkflow } from './entity/approval-workflow.entity';
import { ApprovalWorkflowRole } from './entity/approval-workflow-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Approval,
      ApprovalWorkflow,
      ApprovalWorkflowRole,
    ]),
  ],
})
export class WorkflowModule {}
