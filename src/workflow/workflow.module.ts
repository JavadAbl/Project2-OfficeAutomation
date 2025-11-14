import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowController } from './controller/workflow.controller';
import { IdentityModule } from 'src/identity/identity.module';
import { Workflow } from './entity/workflow.entity';
import { WorkflowService } from './service/workflow.service';
import { LetterModule } from 'src/letter/letter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workflow]), IdentityModule, LetterModule],
  providers: [WorkflowService],
  controllers: [WorkflowController],
})
export class WorkflowModule {}
