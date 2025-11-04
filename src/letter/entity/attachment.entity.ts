import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Letter } from './letter.entity';

@Entity()
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @Column()
  file_path: string;

  @ManyToOne(() => Letter, (en) => en.attachments)
  letter: Letter;
}
