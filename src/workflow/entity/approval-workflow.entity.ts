import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Approval } from './approval.entity';
import { ApprovalWorkflowRole } from './approval-workflow-role.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Template } from 'src/letter/entity/template.entity';

@Entity()
export class ApprovalWorkflow extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Template, (en) => en.approvalWorkflow)
  templates: Template[];

  @ManyToMany(() => Approval, (approval) => approval.workflow)
  @JoinTable({ name: 'approval_workflow_approvals	' })
  approvals: Approval[];

  @ManyToMany(() => ApprovalWorkflowRole, (entity) => entity.approvalWorkflows)
  @JoinTable({ name: 'approval_workflow_roles	' })
  approvalWorkflowRoles: ApprovalWorkflowRole[];
}
