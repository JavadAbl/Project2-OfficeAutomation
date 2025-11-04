import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { ApprovalWorkflow } from './approval-workflow.entity';
import { UserRole } from 'src/identity/entity/user-roles';
import { Department } from 'src/identity/entity/department.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class ApprovalWorkflowRole extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => ApprovalWorkflow, (entity) => entity.approvalWorkflowRoles)
  approvalWorkflows: ApprovalWorkflow[];

  @ManyToOne(() => UserRole, (entity) => entity.approvalWorkflowRoles)
  userRole: UserRole;

  @ManyToOne(() => Department, (entity) => entity.approvalWorkflowRoles)
  department: Department;
}
