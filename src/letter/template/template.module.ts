import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entity/template.entity';
import { TemplateController } from './controller/template.controller';
import { TemplateService } from './service/template.service';

@Module({
  imports: [TypeOrmModule.forFeature([Template])],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
