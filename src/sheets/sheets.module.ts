import { Module } from '@nestjs/common';
import { SheetsController } from './controller/sheets.controller';

@Module({
  controllers: [SheetsController]
})
export class SheetsModule { }
