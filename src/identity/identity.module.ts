import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { DepartmentController } from './controller/department.controller';
import { DepartmentService } from './service/department.service';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRole } from './entity/user-roles';
import { Permission } from './entity/permission.entity';
import { Department } from './entity/department.entity';
import { DepartmentRole } from './entity/department-role';
import { DepartmentRoleService } from './service/department-role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole,
      Permission,
      Department,
      DepartmentRole,
    ]),
  ],
  controllers: [UserController, DepartmentController],
  providers: [DepartmentService, UserService, DepartmentRoleService],
  exports: [UserService, DepartmentRoleService],
})
export class IdentityModule {}
