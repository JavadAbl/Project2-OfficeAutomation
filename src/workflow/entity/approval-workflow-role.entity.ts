import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { ApprovalWorkflow } from './approval-workflow.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from 'src/identity/entity/department-role';

@Entity()
export class ApprovalWorkflowRole extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => ApprovalWorkflow, (entity) => entity.approvalWorkflowRoles)
  approvalWorkflows: ApprovalWorkflow[];

  @ManyToMany(
    () => DepartmentRole,
    (departmentRoles) => departmentRoles.approvalWorkflowRoles,
  )
  @JoinTable({ name: 'approval-workflow-department-roles' })
  departmentRoles: DepartmentRole[];
}
