import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './controller/workflow.controller';
import { Workflow } from './entity/workflow.entity';
import { WorkflowService } from './service/workflow.service';
import { LetterModule } from 'src/letter/letter.module';
import { DepartmentModule } from 'src/identity/department/department.module';
import { TemplateModule } from 'src/letter/template/template.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workflow]),
    LetterModule,
    DepartmentModule,
    TemplateModule,
  ],
  providers: [WorkflowService],
  controllers: [WorkflowController],
})
export class WorkflowModule {}
