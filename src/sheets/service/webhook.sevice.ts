export class WebhookService {
    async googleSheetsWebhook(payload: any) {
        const { spreadsheetId, responses, timestamp } = payload;
        console.log(spreadsheetId, responses, timestamp);
    }
}