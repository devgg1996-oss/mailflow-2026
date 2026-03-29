import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SheetService } from './sheet/sheet.service';
import { SheetModule } from './sheet/sheet.module';
import { ContactModule } from './contact/contact.module';
import { CampaignModule } from './campaign/campaign.module';
import { EmailTemplateService } from './email_template/email_template.service';
import { EmailTemplateModule } from './email_template/email_template.module';
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
    UserModule,
    SheetModule,
    ContactModule,
    CampaignModule,
    EmailTemplateModule,
    EmailsModule,
    SheetsModule,
    CampaignsModule,
    CommonsModule,
    AuthModule,
  ],
  controllers: [AppController, CampaignsController, CommonsController],
  providers: [AppService, SheetService, EmailTemplateService, SheetsService, CommonsService],
})
export class AppModule { }
