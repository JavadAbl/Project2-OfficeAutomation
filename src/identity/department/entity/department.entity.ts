import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from './department-role.entity';

@Entity()
export class Department extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => DepartmentRole, (en) => en.department)
  departmentRoles: DepartmentRole[];
}
