import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { PrismaService } from "src/prisma/prisma.service";
import { ulid } from "ulid";

const EMAIL_QUEUE = "sheets-response-email-queue";

@Injectable()
export class WebhookService {
    constructor(
        private readonly prismaService: PrismaService,
        @InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue,
    ) {}

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

        let name = '';
        let email = '';
        for (const [key, value] of Object.entries(responses)) {
            if (key === '이름' || key === '성함') {
                name = value?.[0]?.toString().trim() ?? '';
            } else if (key === '이메일' && Array.isArray(value)) {
                email = value[0]?.toString().trim() ?? '';
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

        // Redis 큐에 작업 추가 (Job) -- 개인화 이메일 발송을 위한 준비
        await this.emailQueue.add('send-individual-mail', {
            spreadsheetId,
            email,
            name,
            rawValues: responses,
          }, 
          {
            // 옵션: 실패 시 3번 재시도, 5초 간격으로 지연 발생
            attempts: 3,
            backoff: { type: 'fixed', delay: 5000 },
            removeOnComplete: true, // 성공 시 Redis에서 삭제 (메모리 절약)
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