import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Department } from './department.entity';
import { UserRole } from './user-roles';
import { Letter } from 'src/letter/entity/letter.entity';
import { Recipient } from 'src/letter/entity/recipient.entity';
import { Permission } from './permission.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  password: string;

  @ManyToOne(() => Department, (entity) => entity.users, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department: Department;
  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(() => UserRole, (entity) => entity.users)
  role: UserRole;

  @OneToMany(() => Letter, (Letter) => Letter.creatorUser)
  createdLetters: Letter[];

  @OneToMany(() => Recipient, (recipient) => recipient.user)
  recipientEntries: Recipient[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'user_permissions',
  })
  permissions: Permission[];
}
