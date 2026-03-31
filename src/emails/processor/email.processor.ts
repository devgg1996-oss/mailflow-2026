import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { PrismaService } from "src/prisma/prisma.service";
import { SheetCampaignType } from "src/utils";
import { EmailsService } from "../service/emails.service";

@Processor('sheets-response-email-queue')
export class EmailProcessor extends WorkerHost {
    constructor(
        private readonly prismaService: PrismaService, 
        private readonly emailsService: EmailsService) {
        super();
    }

    async process(job: Job): Promise<any> {
        const { spreadsheetId, email, name, rawValues } = job.data;

        // 1. 이메일 템플릿 조회
        const sheet = await this.prismaService.sheet.findUnique({
            where: {
                id: spreadsheetId,
            },
            include: {
                campaigns: {
                    where: { type: SheetCampaignType.RESPONSE_AFTER }
                }
            },
        });

        if (!sheet) {
            throw new Error('Sheet not found');
        }

        if (sheet.campaigns.length === 0) {
            switch (job.name) {
                case 'send-individual-mail':
                  // 1. 개인화 템플릿 제작 (Handlebars 등 활용 가능)
                  const subject = `[${sheet.title}] 안녕하세요 ${name}님, 신청이 완료되었습니다!`;
                  const content = `안녕하세요 ${name}님! 신청해주셔서 감사합니다.`;
          
                  // 2. 실제 이메일 발송 서비스 호출 (Nodemailer, SES 등)
                  console.log(`[Worker] ${email}에게 메일 발송 중...`);
                  await this.emailsService.sendEmail(email, subject, content);
                  break;
                default:
                  throw new Error('Invalid job name');
              }
        }
    }
}