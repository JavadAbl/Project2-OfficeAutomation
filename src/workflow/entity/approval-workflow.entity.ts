import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ApprovalWorkflowRole } from './approval-workflow-role.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Template } from 'src/letter/entity/template.entity';
import { LetterApproval } from 'src/letter/entity/letter-approval.entity';

@Entity()
export class ApprovalWorkflow extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Template, (en) => en.approvalWorkflows)
  templates: Template[];

  @ManyToMany(() => LetterApproval, (approval) => approval.workflow)
  letterApprovals: LetterApproval[];

  @ManyToMany(() => ApprovalWorkflowRole, (entity) => entity.approvalWorkflows)
  @JoinTable()
  approvalWorkflowRoles: ApprovalWorkflowRole[];
}
