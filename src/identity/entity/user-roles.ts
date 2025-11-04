import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ApprovalWorkflowRole } from 'src/workflow/entity/approval-workflow-role.entity';
import { Permission } from './permission.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity({ synchronize: true })
export class UserRole extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'permission_id',
    },
  })
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => ApprovalWorkflowRole, (en) => en.userRole)
  approvalWorkflowRoles: ApprovalWorkflowRole[];
}
