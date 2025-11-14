import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { Letter } from './letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Workflow } from 'src/workflow/entity/workflow.entity';

@Entity()
export class Template extends BaseEntity {
  @Column()
  name: string;

  @Column()
  subject: string;

  @Column()
  fileName: string;

  @OneToMany(() => Letter, (en) => en.template)
  letters: Letter[];

  @ManyToMany(() => Workflow, (en) => en.templates)
  workflows: Workflow[];
}
