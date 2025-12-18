import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './_department/entity/department.entity';
import { DepartmentRole } from './_department/entity/department-role.entity';
import { DepartmentController } from './_department/controller/department.controller';
import { DepartmentRoleService } from './_department/service/department-role.service';
import { DepartmentService } from './_department/service/department.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, DepartmentRole])],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentRoleService],
  exports: [DepartmentService, DepartmentRoleService],
})
export class DepartmentModule {}
