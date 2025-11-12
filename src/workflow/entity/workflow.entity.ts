import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Template } from 'src/letter/entity/template.entity';
import { DepartmentRole } from 'src/identity/entity/department-role';

@Entity()
export class Workflow extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Template, (en) => en.workflows)
  templates: Template[];

  @ManyToMany(() => DepartmentRole, (en) => en.workflows)
  departmentRoles: DepartmentRole[];
}
