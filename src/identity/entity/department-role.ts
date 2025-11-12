import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Department } from './department.entity';
import { Workflow } from 'src/workflow/entity/workflow.entity';

@Entity()
export class DepartmentRole extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToOne(() => Department, (en) => en.departmentRoles, { nullable: false })
  @JoinColumn({ name: 'departmentId' })
  department: Department;
  @Column({ nullable: false })
  departmentId: number;

  @ManyToMany(() => Workflow, (en) => en.departmentRoles)
  @JoinTable()
  workflows: Workflow[];
}
