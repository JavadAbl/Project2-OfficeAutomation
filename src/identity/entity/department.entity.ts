import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ApprovalWorkflowRole } from 'src/workflow/entity/approval-workflow-role.entity';

@Entity({ synchronize: true })
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (en) => en.department)
  users: User[];

  @OneToMany(() => ApprovalWorkflowRole, (en) => en.department)
  approvalWorkflowRoles: ApprovalWorkflowRole[];
}
