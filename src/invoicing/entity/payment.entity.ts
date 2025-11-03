import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';
import { Organization } from 'src/auth/entity/organization.entity';
import { User } from 'src/auth/entity/user.entity';
import { randomUUID } from 'crypto';
import { Vendor } from 'src/contacts/entity/vendor.entity';

@Entity('payments', { synchronize: false })
export class Payment {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ type: 'bigint' })
  amountCents: string;

  @Column()
  currency: string;

  @Column()
  method: string; // e.g., 'bank_transfer', 'credit_card', 'cash'

  @Column({ type: 'timestamp' })
  receivedAt: Date;

  @Column({ nullable: true })
  externalRef: string; // e.g., transaction ID from payment processor

  @Column()
  status: string; // e.g., 'succeeded', 'pending', 'failed'

  @CreateDateColumn()
  createdAt: Date;
}
