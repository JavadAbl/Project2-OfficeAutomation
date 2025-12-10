import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/identity/department/entity/department.entity';
import { UserRole } from 'src/identity/user/entity/user-roles';
import { User } from 'src/identity/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: 'app.db',
        // autoLoadEntities: true,
        entities: [Department, UserRole, User],
        synchronize: true,
      }),
    }),
  ],
  providers: [SeedService],
})
export class SeedModule {}
