import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Letter } from './letter.entity';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  template_name: string;

  @Column()
  subject_template: string;

  @Column('text')
  body_template: string;

  @OneToMany(() => Letter, (en) => en.template)
  letters: Letter[];
}
