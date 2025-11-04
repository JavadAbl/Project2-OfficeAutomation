import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApprovalWorkflowRole } from 'src/workflow/entity/approval-workflow-role.entity';
import { Permission } from './permission.entity';

@Entity({ synchronize: true })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  role: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

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
