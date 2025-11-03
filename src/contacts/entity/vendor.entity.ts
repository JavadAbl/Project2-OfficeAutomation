import { Organization } from 'src/auth/entity/organization.entity';
import { Invoice } from 'src/invoicing/entity/invoice.entity';
import { Payment } from 'src/invoicing/entity/payment.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('vendors', { synchronize: false })
export class Vendor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Organization, (organization) => organization.vendors)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Invoice, (invoice) => invoice.vendor)
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.vendor)
  payments: Payment[];
}
