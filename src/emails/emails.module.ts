import { Module } from '@nestjs/common';
import { EmailsController } from './controller/emails.controller';
import { EmailsService } from './service/emails.service';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService]
})
export class EmailsModule { }
