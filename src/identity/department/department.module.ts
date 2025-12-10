import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entity/department.entity';
import { DepartmentRole } from './entity/department-role.entity';
import { DepartmentController } from './controller/department.controller';
import { DepartmentService } from './service/department.service';
import { DepartmentRoleService } from './department-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, DepartmentRole])],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRoleService],
  exports: [DepartmentService, DepartmentRoleService],
})
export class DepartmentModule {}
