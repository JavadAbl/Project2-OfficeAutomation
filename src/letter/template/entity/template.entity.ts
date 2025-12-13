import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Workflow } from 'src/workflow/entity/workflow.entity';

@Entity()
export class Template extends BaseEntity {
  @Column()
  name: string;

  @Column()
  fileName: string;

  @ManyToMany(() => Workflow, (en) => en.templates)
  workflows: Workflow[];
}
