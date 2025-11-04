import { Entity, Column, OneToMany } from 'typeorm';
import { Letter } from './letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class Template extends BaseEntity {
  @Column()
  templateName: string;

  @Column()
  subjectTemplate: string;

  @Column('text')
  body_template: string;

  @OneToMany(() => Letter, (en) => en.template)
  letters: Letter[];
}
