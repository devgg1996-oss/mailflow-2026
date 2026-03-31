import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseUsersService } from 'src/users/service/base-users.service';
import { ulid } from 'ulid';
import { google } from 'googleapis';

const scriptCode = `
function onFormSubmit(e) {
  var url = "https://inappreciably-dorsiferous-trish.ngrok-free.dev/webhooks/google-sheets";
  var payload = JSON.stringify({
    spreadsheetId: SpreadsheetApp.getActiveSpreadsheet().getId(),
    responses: e.namedValues, // 구글 폼 응답 데이터
    timestamp: new Date()
  });
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": payload
  };
  
  UrlFetchApp.fetch(url, options);
}
`;

@Injectable()
export class SheetsService {
    constructor(
        @Inject(BaseUsersService) private readonly baseUsersService: BaseUsersService, 
        @Inject(PrismaService) private readonly prisma: PrismaService,
    ) {}

    /**
     * 구글시트 등록
     * 1. 사용자의 구글 refresh token 이용해서 Google OAuth2 클라이언트 설정
     * 2. Google Sheets API 호출 (실제 시트가 존재하는지, 접근 가능한지 확인)
     * 3. DB에 시트가 존재하지 않으면 생성
     */
    async registerSheets(userGuid: string, params: any) {
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
                        createdAt: new Date(),
                    },
                });
            }
            return sheets;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    
    /**
     * 구글시트 응답 상세 조회
     * 1. 사용자의 구글 refresh token 이용해서 Google OAuth2 클라이언트 설정
     * 2. Google Sheets API 호출 (실제 시트가 존재하는지, 접근 가능한지 확인)
     * 3. 시트의 모든 응답 가져오기
     */
    async getSheetDetails(userGuid: string, sheetId: string) {
        const user = await this.baseUsersService.getUserByGuid(userGuid);
        const googleRefreshToken = user.refreshToken;

        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        );

        auth.setCredentials({ refresh_token: googleRefreshToken });

        try {
            const sheetsApi = google.sheets({ version: 'v4', auth });
            const response = await sheetsApi.spreadsheets.values.get({
                spreadsheetId: sheetId,
                range: 'A:Z',
            });

            const rows = response.data?.values;

            return rows || [];

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * 구글시트 스크립트 등록
     * 1. 사용자의 구글 refresh token 이용해서 Google OAuth2 클라이언트 설정
     * 2. Apps Script 프로젝트 생성
     * 3. 코드 파일 업로드
     * 4. 트리거 설정
     */
    async registerScript(userGuid: string, sheetId: string): Promise<any> {
        const user = await this.baseUsersService.getUserByGuid(userGuid);
        const googleRefreshToken = user.refreshToken;

        const auth = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
        );

        auth.setCredentials({ refresh_token: googleRefreshToken });
        const scriptApi = google.script({ version: 'v1', auth });

        try {
            // 2. Apps Script 프로젝트 생성
            const project = await scriptApi.projects.create({
                requestBody: {
                    title: `${sheetId} - Trigger`,
                    parentId: user.providerId,
                },
            });

            // 3. 코드 파일 업로드
            const code = await scriptApi.projects.updateContent({
                scriptId: project.data.scriptId || 'default',
                requestBody: {
                    files: [{
                        name: 'main',
                        type: 'SERVER_JS',
                        source: scriptCode,
                      }, {
                        name: 'appsscript',
                        type: 'JSON',
                        source: JSON.stringify({
                          timeZone: 'Asia/Seoul',
                          exceptionLogging: 'STACKDRIVER',
                          runtimeVersion: 'V8'
                        })
                      }]
                },
            });
            
            // 4. 트리거 설정

            return project;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
