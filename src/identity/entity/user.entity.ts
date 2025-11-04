import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from './department.entity';
import { UserRole } from './user-roles';
import { Letter } from 'src/letter/entity/letter.entity';
import { Recipient } from 'src/letter/entity/recipient.entity';
import { Permission } from './permission.entity';

@Entity({ synchronize: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  /*  @ManyToOne(() => Department, (entity) => entity.users, {
    nullable: false,
  }) */
  department: Department;

  //  @ManyToOne(() => UserRole, (entity) => entity.users)
  role: UserRole;

  // @OneToMany(() => Letter, (Letter) => Letter.creatorUser)
  createdLetters: Letter[];

  // @OneToMany(() => Recipient, (recipient) => recipient.user)
  recipientEntries: Recipient[];

  /*   @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'role_id' },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'permission_id',
    },
  }) */
  permissions: Permission[];
}
