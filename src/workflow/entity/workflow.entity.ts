import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Template } from 'src/letter/template/entity/template.entity';
import { DepartmentRole } from 'src/identity/department/entity/department-role.entity';

@Entity()
export class Workflow extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Template, { nullable: false })
  @JoinTable()
  templates: Template[];

  @ManyToMany(() => DepartmentRole, { nullable: false })
  @JoinTable()
  departmentRoles: DepartmentRole[];
}
