import { Module } from '@nestjs/common';
import { SheetsController } from './controller/sheets.controller';
import { SheetsService } from './service/sheets.service';
import { BaseUsersService } from 'src/users/service/base-users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhookController } from './controller/webhook.controller';
import { WebhookService } from './service/webhook.sevice';

@Module({
  controllers: [SheetsController, WebhookController],
  providers: [SheetsService, BaseUsersService, PrismaService, WebhookService]
})
export class SheetsModule { }
