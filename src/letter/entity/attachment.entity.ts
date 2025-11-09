import { Entity, Column, ManyToOne } from 'typeorm';
import { Letter } from './letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class Attachment extends BaseEntity {
  @Column()
  fileName: string;

  @ManyToOne(() => Letter, (en) => en.attachments)
  letter: Letter;
}
