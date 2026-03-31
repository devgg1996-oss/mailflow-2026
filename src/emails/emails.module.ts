import { Module } from '@nestjs/common';
import { EmailsController } from './controller/emails.controller';
import { EmailsService } from './service/emails.service';
import { EmailProcessor } from './processor/email.processor';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService, EmailProcessor],
  exports: [EmailsService, EmailProcessor]
})
export class EmailsModule { }
