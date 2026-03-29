import { Module } from '@nestjs/common';
import { CampaignsController } from './controller/campaigns.controller';
import { CampaignsService } from './service/campaigns.service';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService]
})
export class CampaignsModule { }
