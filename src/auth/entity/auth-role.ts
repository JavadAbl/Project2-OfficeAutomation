import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity({ synchronize: true })
export class AuthRole extends BaseEntity {
  @Column({ unique: true, nullable: false })
  name: string;
}
