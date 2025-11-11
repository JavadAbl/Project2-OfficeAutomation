import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Department } from './department.entity';
import { ApprovalWorkflowRole } from 'src/workflow/entity/approval-workflow-role.entity';

@Entity()
export class DepartmentRole extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToOne(() => Department, (en) => en.departmentRoles, { nullable: false })
  @JoinColumn({ name: 'departmentId' })
  department: Department;
  @Column({ nullable: false })
  departmentId: number;

  @ManyToMany(() => ApprovalWorkflowRole, (en) => en.departmentRoles)
  approvalWorkflowRoles: ApprovalWorkflowRole[];
}
