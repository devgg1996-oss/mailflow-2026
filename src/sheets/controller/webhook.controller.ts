import { Body, Post } from "@nestjs/common";
import { WebhookService } from "../service/webhook.sevice";

export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}

    @Post('google-sheets')
    async googleSheetsWebhook(@Body() body: any) {
        console.log(body);
        return this.webhookService.googleSheetsWebhook(body);
    }
}