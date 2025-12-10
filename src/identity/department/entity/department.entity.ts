import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from './department-role.entity';
import { User } from 'src/identity/user/entity/user.entity';

@Entity()
export class Department extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => User, (en) => en.department)
  users: User[];

  @OneToMany(() => DepartmentRole, (en) => en.department)
  departmentRoles: DepartmentRole[];
}
