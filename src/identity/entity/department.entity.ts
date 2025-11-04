import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ApprovalWorkflowRole } from 'src/workflow/entity/approval-workflow-role.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity({ synchronize: true })
export class Department extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => User, (en) => en.department)
  users: User[];

  @OneToMany(() => ApprovalWorkflowRole, (en) => en.department)
  approvalWorkflowRoles: ApprovalWorkflowRole[];
}
