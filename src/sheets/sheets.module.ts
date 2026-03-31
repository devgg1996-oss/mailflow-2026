import { Module } from '@nestjs/common';
import { SheetsController } from './controller/sheets.controller';
import { SheetsService } from './service/sheets.service';
import { BaseUsersService } from 'src/users/service/base-users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [SheetsController],
  providers: [SheetsService, BaseUsersService, PrismaService]
})
export class SheetsModule { }
