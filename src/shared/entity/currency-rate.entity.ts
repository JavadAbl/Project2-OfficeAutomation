import { randomUUID } from 'crypto';
import { Organization } from 'src/auth/entity/organization.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity('currency_rates', { synchronize: false })
export class CurrencyRate {
  @PrimaryColumn('uuid')
  id: string = randomUUID();

  @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column()
  baseCurrency: string; // e.g., 'USD'

  @Column()
  targetCurrency: string; // e.g., 'EUR'

  @Column({ type: 'decimal', precision: 10, scale: 6 })
  rate: number; // e.g., 0.851234

  @Column({ type: 'timestamp' })
  validAt: Date; // The date/time this rate is effective from
}
