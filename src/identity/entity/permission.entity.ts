// Permission.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UserRole } from './user-roles';
import { User } from './user.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permission: string;

  @ManyToMany(() => UserRole, (en) => en.permissions)
  roles: UserRole[];

  @ManyToMany(() => User, (en) => en.permissions)
  users: User[];
}
