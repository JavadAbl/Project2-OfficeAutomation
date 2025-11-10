import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Letter } from './letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { E1 } from './e1.entity';

@Entity()
export class E2 extends BaseEntity {
  @Column()
  name: string;

  @OneToOne(() => E1, (e1) => e1.e2)
  @JoinColumn({ name: 'e1Id' })
  e1: E1;

  @Column({ nullable: true })
  e1Id: number;
}
