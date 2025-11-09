import { Body, Controller, Post, Put } from '@nestjs/common';
import { LetterService } from '../service/letter.service';
import { LetterSetPriorityRequest } from '../contract/request/letter-set-priority.request';
import { LetterSetTemplateRequest } from '../contract/request/letter-set-template.request';

@Controller('letter')
export class LetterController {
  constructor(private readonly service: LetterService) {}

  @Post()
  createLetterEndpoint() {
    return this.service.create();
  }

  @Put('SetPriority')
  setLetterPriorityEndpoint(
    @Body() payload: LetterSetPriorityRequest,
  ): Promise<void> {
    return this.service.setPriority(payload);
  }

  @Put('SetTemplate')
  setLetterTemplateEndpoint(
    @Body() payload: LetterSetTemplateRequest,
  ): Promise<void> {
    return this.service.setTemplate(payload);
  }
}
