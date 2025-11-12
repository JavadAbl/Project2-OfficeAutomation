import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Letter } from 'src/letter/entity/letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity()
export class LetterApproval extends BaseEntity {
  @Column()
  status: number;

  @ManyToOne(() => Letter, (Letter) => Letter.letterApprovals)
  @JoinColumn({ name: 'letterId' })
  letter: Letter;

  @Column({ nullable: true })
  letterId: number;
}
