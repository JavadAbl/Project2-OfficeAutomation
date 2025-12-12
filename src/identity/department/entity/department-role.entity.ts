import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Department } from './department.entity';
import { Workflow } from 'src/workflow/entity/workflow.entity';
import { AuthRole } from 'src/auth/entity/auth-role';
import { User } from 'src/identity/user/entity/user.entity';

@Entity()
export class DepartmentRole extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToOne(() => Department, (en) => en.departmentRoles, { nullable: false })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: false })
  departmentId: number;

  @ManyToOne(() => AuthRole, { nullable: false })
  @JoinColumn({ name: 'authRoleId' })
  authRole: AuthRole;

  @Column({ nullable: false, default: 3 })
  authRoleId: number;

  @OneToMany(() => User, (u) => u.departmentRole)
  users: User[];

  @ManyToMany(() => Workflow, (en) => en.departmentRoles)
  workflows: Workflow[];
}
