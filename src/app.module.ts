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
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EmailsModule,
    SheetsModule,
    CampaignsModule,
    CommonsModule,
    AuthModule,
    UsersModule,
    JwtModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? '6379'),
      },
    }),
    // 큐 등록
    BullModule.registerQueue({
      name: 'sheets-response-email-queue',
    })
  ],
  controllers: [AppController, CampaignsController, CommonsController],
  providers: [AppService, SheetsService, CommonsService],
})
export class AppModule { }
