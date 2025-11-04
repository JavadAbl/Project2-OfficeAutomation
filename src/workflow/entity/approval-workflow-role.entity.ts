// ApprovalWorkflow.ts

import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApprovalWorkflow } from './approval-workflow.entity';
import { UserRole } from 'src/identity/entity/user-roles';
import { Department } from 'src/identity/entity/department.entity';

@Entity()
export class ApprovalWorkflowRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  workflow_name: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => ApprovalWorkflow, (entity) => entity.approvalWorkflowRoles)
  approvalWorkflows: ApprovalWorkflow[];

  // @ManyToOne(() => UserRole, (entity) => entity.approvalWorkflowRoles)
  userRole: UserRole;

  // @ManyToOne(() => Department, (entity) => entity.approvalWorkflowRoles)
  department: Department;
}
