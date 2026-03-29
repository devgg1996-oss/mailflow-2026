import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmailsModule } from './emails/emails.module';
import { SheetsService } from './sheets/service/sheets.service';
import { SheetsModule } from './sheets/sheets.module';
import { CampaignsController } from './campaigns/controller/campaigns.controller';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CommonsService } from './commons/service/commons.service';
import { CommonsController } from './commons/controller/commons.controller';
import { CommonsModule } from './commons/commons.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EmailsModule,
    SheetsModule,
    CampaignsModule,
    CommonsModule,
    AuthModule,
  ],
  controllers: [AppController, CampaignsController, CommonsController],
  providers: [AppService, SheetsService, CommonsService],
})
export class AppModule { }
