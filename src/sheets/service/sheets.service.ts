import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseUsersService } from 'src/users/service/base-users.service';
import { ulid } from 'ulid';
import { google } from 'googleapis';

@Injectable()
export class SheetsService {
    constructor(
        @Inject(BaseUsersService) private readonly baseUsersService: BaseUsersService, 
        @Inject(PrismaService) private readonly prisma: PrismaService,
    ) {}

    /**
     *
     * 1. 사용자의 구글 refresh token 이용해서 Google OAuth2 클라이언트 설정
     * 2. Google Sheets API 호출 (실제 시트가 존재하는지, 접근 가능한지 확인)
     */
    async getSheets(userGuid: string, params: any) {
        const user = await this.baseUsersService.getUserByGuid(userGuid);
        console.log(user);
        const googleRefreshToken = user.refreshToken;

        // Google OAuth2 클라이언트 설정
        const auth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
        );

        auth.setCredentials({ refresh_token: googleRefreshToken });

        try {

            // 2. 실제 시트가 존재하는지, 접근 가능한지 확인
            const sheetsApi = google.sheets({ version: 'v4', auth });
            const response = await sheetsApi.spreadsheets.get({
              spreadsheetId: params.sheetId,
            });

            const sheetTitle = response.data?.properties?.title;
            console.log(sheetTitle);
            if(!sheetTitle) {
                throw new BadRequestException('Sheet title not found');
            }
      
            const sheets = await this.prisma.sheet.findFirst({
                where: {
                    userId: user.id,
                    deletedAt: null,
                    sheetId: params.sheetId,
                },
            });

            if(!sheets) {
                const newSheet = await this.prisma.sheet.create({
                    data: {
                        guid: ulid(),
                        userId: user.id,
                        userGuid: user.guid,
                        sheetId: user.providerId,
                        title: sheetTitle,
                    },
                });
            }
            return sheets;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
