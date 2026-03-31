import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SheetsController } from './controller/sheets.controller';
import { SheetsService } from './service/sheets.service';
import { BaseUsersService } from 'src/users/service/base-users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhookController } from './controller/webhook.controller';
import { WebhookService } from './service/webhook.sevice';
import { EmailsService } from 'src/emails/service/emails.service';
import { EmailProcessor } from 'src/emails/processor/email.processor';
import { EmailsModule } from 'src/emails/emails.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sheets-response-email-queue',
    }),
    EmailsModule,
  ],
  controllers: [SheetsController, WebhookController],
  providers: [SheetsService, BaseUsersService, PrismaService, WebhookService]
})
export class SheetsModule { }
