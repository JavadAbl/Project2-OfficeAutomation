import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { DepartmentRole } from 'src/identity/department/_department/entity/department-role.entity';
import { Workflow } from 'src/workflow/_workflow/entity/workflow.entity';

@Entity()
export class Template extends BaseEntity {
  @Column()
  name: string;

  @Column()
  fileName: string;

  @ManyToMany(() => Workflow)
  @JoinTable({ name: 'template_workflows' })
  workflows: Workflow[];

  @ManyToMany(() => DepartmentRole)
  @JoinTable({ name: 'template_approvals' })
  approvalDepartmentRoles: DepartmentRole[];
}
