import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Template } from 'src/letter/entity/template.entity';
import { DepartmentRole } from 'src/identity/entity/department-role.entity';

@Entity()
export class Workflow extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Template, (en) => en.workflows)
  @JoinTable()
  templates: Template[];

  @ManyToMany(() => DepartmentRole, (en) => en.workflows)
  @JoinTable()
  departmentRoles: DepartmentRole[];
}
