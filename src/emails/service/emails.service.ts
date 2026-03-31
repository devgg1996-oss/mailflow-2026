import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SheetCampaignType } from 'src/utils';
import { ulid } from 'ulid';

@Injectable()
export class EmailsService {
    constructor(private readonly prismaService: PrismaService) {}

    async sendEmail(user: any, email: string, subject: string, content: string) {
        const emailTemplate = await this.prismaService.emailTemplate.create({
            data: {
                guid: ulid(),
                title: subject,
                body: content,
                userId: user.id,
                userGuid: user.guid,
            },
        });

        
    }
}
