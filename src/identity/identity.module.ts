import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [UserModule, DepartmentModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class IdentityModule {}
