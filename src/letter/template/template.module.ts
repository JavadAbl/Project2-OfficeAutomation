import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './_template/entity/template.entity';
import { TemplateController } from './_template/controller/template.controller';
import { DepartmentModule } from 'src/identity/department/department.module';
import { TemplateService } from './_template/service/template.service';

@Module({
  imports: [TypeOrmModule.forFeature([Template]), DepartmentModule],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
