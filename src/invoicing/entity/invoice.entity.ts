import { randomUUID } from 'crypto';
import { Organization } from 'src/auth/entity/organization.entity';
import { User } from 'src/auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceLine } from './invoice-line.entity';
import { Payment } from './payment.entity';
import { Customer } from 'src/contacts/entity/ customer.entity';
import { Vendor } from 'src/contacts/entity/vendor.entity';

@Entity('invoices', { synchronize: false })
export class Invoice {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser: User;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ unique: true }) // Invoice numbers should be unique per organization
  number: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  // NOTE: In a real app, this would likely be a foreign key to a 'CUSTOMER' or 'CONTACT' table.
  // Storing it as a string UUID is a simplification based on the provided diagram.
  customer: string;

  @Column()
  status: string; // e.g., 'draft', 'sent', 'paid', 'overdue', 'void'

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column()
  currency: string;

  @Column({ type: 'bigint' })
  subtotalCents: string;

  @Column({ type: 'bigint' })
  taxCents: string;

  @Column({ type: 'bigint' })
  totalCents: string;

  @Column({ type: 'bigint' })
  balanceCents: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => InvoiceLine, (line) => line.invoice, { cascade: true })
  lines: InvoiceLine[];

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];
}
