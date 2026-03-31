import { Body, Controller, Post } from "@nestjs/common";
import { WebhookService } from "../service/webhook.sevice";

@Controller('webhooks')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @Post('google-sheets')
    async googleSheetsWebhook(@Body() body: any) {
        console.log(body);
        /**
         * {
              spreadsheetId: '1rHdUQoUO3cIWIthsExNFUnlhy548FXZDRnGfUIEuZfY',
              responses: {
                '이메일': [ 'devgg1999@gmail.com' ],
                '의견': [ '웹훅 테스트 2' ],
                '전화번호': [ '01000003211' ],
                '타임스탬프': [ '2026. 3. 31 오후 1:48:45' ],
                '이름': [ '강이서 6' ]
              },
              timestamp: '2026-03-31T04:48:48.237Z'
            }
         */
        return this.webhookService.googleSheetsWebhook(body);
    }
}