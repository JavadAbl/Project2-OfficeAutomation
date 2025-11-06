import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Letter } from './letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { ApprovalWorkflow } from 'src/workflow/entity/approval-workflow.entity';

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

  @ManyToOne(() => ApprovalWorkflow, (en) => en.templates)
  approvalWorkflow: ApprovalWorkflow;
}
