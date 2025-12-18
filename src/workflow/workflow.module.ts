import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workflow } from './_workflow/entity/workflow.entity';
import { WorkflowService } from './_workflow/service/workflow.service';
import { DepartmentModule } from 'src/identity/department/department.module';
import { WorkflowController } from './_workflow/controller/workflow.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow]), DepartmentModule],
  providers: [WorkflowService],
  controllers: [WorkflowController],
})
export class WorkflowModule {}
