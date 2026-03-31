import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SheetCampaignType } from 'src/utils';
import { ulid } from 'ulid';
import nodemailer from 'nodemailer';

@Injectable()
export class EmailsService {
    private readonly transporter: nodemailer.Transporter;
  
    constructor(private readonly prismaService: PrismaService) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail', // host, port 대신 'gmail' 한 단어로 설정 가능
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      });
    }
    

    async sendEmail(to: string, name: string, subject: string, content: string) {
        try {
          const info = await this.transporter.sendMail({
            from: `"MailFlow 서비스" <${process.env.MAIL_USER}>`,
            to: to,
            subject,
            // HTML 템플릿 (개인화 변수 적용)
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>안녕하세요, ${name}님!</h2>
                <p>${content}</p>
                <hr />
                <p style="font-size: 12px; color: #888;">본 메일은 수신 동의를 하신 분들께 발송되었습니다.</p>
              </div>
            `,
          });
    
          console.log('메일 발송 성공:', info.messageId);
          return info;
        } catch (error) {
          console.error('메일 발송 에러:', error);
          throw error;
        }
      }
}
