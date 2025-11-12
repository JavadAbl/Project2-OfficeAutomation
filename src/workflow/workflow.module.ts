import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './controller/workflow.controller';
import { IdentityModule } from 'src/identity/identity.module';
import { Workflow } from './entity/workflow.entity';
import { WorkflowService } from './service/workflow.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow]), IdentityModule],
  providers: [WorkflowService],
  controllers: [WorkflowController],
})
export class WorkflowModule {}
