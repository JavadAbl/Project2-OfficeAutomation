import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/auth/entity/organization.entity';
import { UserRoles } from 'src/auth/entity/user-roles';
import { User } from 'src/auth/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: 'app.db',
        // autoLoadEntities: true,
        entities: [Organization, UserRoles, User],
        synchronize: true,
      }),
    }),
  ],
  providers: [SeedService],
})
export class SeedModule {}
