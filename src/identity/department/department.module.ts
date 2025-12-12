import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entity/department.entity';
import { DepartmentRole } from './entity/department-role.entity';
import { DepartmentController } from './controller/department.controller';
import { DepartmentService } from './service/department.service';
import { DepartmentRoleService } from './service/department-role.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, DepartmentRole]),
    forwardRef(() => AuthModule),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRoleService],
  exports: [DepartmentService, DepartmentRoleService],
})
export class DepartmentModule {}
