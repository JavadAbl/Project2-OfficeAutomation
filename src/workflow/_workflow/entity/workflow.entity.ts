import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from 'src/identity/department/_department/entity/department-role.entity';

@Entity()
export class Workflow extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => DepartmentRole, { nullable: false })
  @JoinTable()
  departmentRoles: DepartmentRole[];
}
