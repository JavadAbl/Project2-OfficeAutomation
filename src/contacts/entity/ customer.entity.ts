import { Invoice } from 'src/invoicing/entity/invoice.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

// customer.entity.ts
@Entity('customers', { synchronize: false })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organization_id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  tax_id: string;

  @Column({ type: 'jsonb', nullable: true })
  billing_address: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoices: Invoice[];
}
