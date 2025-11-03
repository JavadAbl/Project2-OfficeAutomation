import { randomUUID } from 'crypto';
import { Organization } from 'src/auth/entity/organization.entity';
import { Payment } from 'src/invoicing/entity/payment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('bank_transactions', { synchronize: false })
export class BankTransaction {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'bigint' })
  amountCents: string;

  @Column()
  currency: string;

  @Column()
  description: string;

  @Column({ unique: true })
  externalId: string; // Unique ID from the bank feed

  @ManyToOne(() => Payment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'matched_payment_id' })
  matchedPayment: Payment;

  @CreateDateColumn()
  importedAt: Date;
}
