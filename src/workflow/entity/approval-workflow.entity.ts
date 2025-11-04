// ApprovalWorkflow.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Approval } from './approval.entity';
import { ApprovalWorkflowRole } from './approval-workflow-role.entity';

@Entity()
export class ApprovalWorkflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workflow_name: string;

  @ManyToMany(() => Approval, (approval) => approval.workflow)
  approvals: Approval[];

  @ManyToMany(() => ApprovalWorkflowRole, (entity) => entity.approvalWorkflows)
  approvalWorkflowRoles: ApprovalWorkflowRole[];
}
