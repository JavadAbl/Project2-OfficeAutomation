// Permission.ts
import { Entity, Column, ManyToMany } from 'typeorm';
import { UserRole } from './user-roles';
import { User } from './user.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity({ synchronize: true })
export class Permission extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => UserRole, (en) => en.permissions)
  roles: UserRole[];

  @ManyToMany(() => User, (en) => en.permissions)
  users: User[];
}
