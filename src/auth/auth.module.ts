import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../identity/entity/user.entity';
import { ApprovalWorkflow } from 'src/workflow/entity/approval-workflow.entity';
import { ApprovalWorkflowRole } from 'src/workflow/entity/approval-workflow-role.entity';
import { Approval } from 'src/workflow/entity/approval.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApprovalWorkflow,
      ApprovalWorkflowRole,
      Approval,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
