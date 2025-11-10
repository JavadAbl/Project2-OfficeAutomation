import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Letter } from './letter.entity';
import { BaseEntity } from 'src/common/entity/base.entity';
import { E2 } from './e2.entity';

@Entity()
export class E1 extends BaseEntity {
  @Column()
  name: string;

  @OneToOne(() => E2, (e2) => e2.e1)
  e2: E2;
}
