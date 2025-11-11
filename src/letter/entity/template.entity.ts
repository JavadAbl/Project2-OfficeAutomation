import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
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

  @ManyToMany(() => ApprovalWorkflow, (en) => en.templates)
  @JoinTable({ name: 'template_approval_workflows' })
  approvalWorkflows: ApprovalWorkflow[];
}
