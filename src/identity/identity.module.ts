import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRole } from './entity/user-roles';
import { Permission } from './entity/permission.entity';
import { Department } from './entity/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Permission, Department])],
  controllers: [UserController, DepartmentController],
  providers: [DepartmentService, UserService],
  exports: [UserService],
})
export class IdentityModule {}
