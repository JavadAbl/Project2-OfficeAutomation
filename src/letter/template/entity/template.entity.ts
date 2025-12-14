import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from 'src/identity/department/entity/department-role.entity';

@Entity()
export class Template extends BaseEntity {
  @Column()
  name: string;

  @Column()
  fileName: string;

  @ManyToMany(() => DepartmentRole)
  @JoinTable({ name: 'template_approvals' })
  approvalDepartmentRoles: DepartmentRole[] = [];
}
