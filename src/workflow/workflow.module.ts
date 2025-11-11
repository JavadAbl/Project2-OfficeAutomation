import { Module } from '@nestjs/common';
import { Approval } from './entity/approval.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApprovalWorkflow } from './entity/approval-workflow.entity';
import { ApprovalWorkflowRole } from './entity/approval-workflow-role.entity';
import { ApprovalWorkflowRoleService } from './service/approval-workflow-role.service';
import { ApprovalWorkflowController } from './controller/approval-workflow.controller';
import { IdentityModule } from 'src/identity/identity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Approval,
      ApprovalWorkflow,
      ApprovalWorkflowRole,
    ]),

    IdentityModule,
  ],
  providers: [ApprovalWorkflowRoleService],
  controllers: [ApprovalWorkflowController],
})
export class WorkflowModule {}
