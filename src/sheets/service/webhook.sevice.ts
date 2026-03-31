import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ulid } from "ulid";

@Injectable()
export class WebhookService {
    constructor(private readonly prismaService: PrismaService) {}

    /**
     * 구글시트 웹훅 처리
     * @param payload { spreadsheetId, responses, timestamp }
     * @returns void
     * 1. DB 시트 조회
     * 2. 이메일 추출
     * 3. DB 연락처 조회
     * 4. 연락처 업데이트 또는 생성
     * 5. 웹훅 히스토리 생성
     */
    async googleSheetsWebhook(payload: any) {
        const { spreadsheetId, responses, timestamp } = payload;
        console.log('webhook received:', spreadsheetId, timestamp);

        const sheet = await this.prismaService.sheet.findFirst({
            where: { sheetId: spreadsheetId, deletedAt: null },
        });

        if (!sheet) {
            console.error('Sheet not found for spreadsheetId:', spreadsheetId);
            return;
        }

        let email = '';
        for (const [key, value] of Object.entries(responses)) {
            if (key === '이메일' && Array.isArray(value)) {
                email = value[0]?.toLowerCase() ?? '';
                break;
            }
        }

        if (!email) {
            console.error('Email not found in responses');
            return;
        }

        await this.prismaService.contact.upsert({
            where: {
                sheetId_email: {
                    sheetId: sheet.id,
                    email,
                },
            },
            update: {
                meta: JSON.stringify(responses),
                updatedAt: new Date(),
            },
            create: {
                guid: ulid(),
                email,
                meta: JSON.stringify(responses),
                userId: sheet.userId,
                userGuid: sheet.userGuid,
                sheetId: sheet.id,
                sheetGuid: sheet.guid,
                createdAt: new Date(),
            },
        });

        // TODO: 웹훅 히스토리 생성 (추후 확장시 추가)
        // await this.prismaService.webhookHistory.create({
        //     data: {
        //         guid: ulid(),
        //         spreadsheetId,
        //         responses,
        //         timestamp,
        //     },
        // });
    }
}