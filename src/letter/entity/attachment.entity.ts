import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Letter } from './letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class Attachment extends BaseEntity {
  @Column()
  fileName: string;

  @ManyToOne(() => Letter, (en) => en.attachments, { nullable: false })
  @JoinColumn({ name: 'letterId' })
  letter: Letter;
  @Column({ nullable: false })
  letterId: number;
}
