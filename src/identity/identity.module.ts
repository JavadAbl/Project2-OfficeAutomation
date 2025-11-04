import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { UserService } from './user.service';

@Module({
  controllers: [UserController, DepartmentController],
  providers: [DepartmentService, UserService]
})
export class IdentityModule {}
