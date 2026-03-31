import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  Header,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiExcludeEndpoint } from '@nestjs/swagger';
import type { Response } from 'express';
import passport from 'passport';
import { GoogleStrategy } from '../strategy/google.strategy';
import { AuthService } from '../service/auth.service';

@ApiTags('Auth')
@Controller('auth/google')
export class GoogleController {
  constructor(
    @Inject(GoogleStrategy) private readonly googleStrategy: GoogleStrategy,
    @Inject(AuthService) private readonly authService: AuthService,
  ) { }

  @Get('')
  @ApiOperation({ summary: 'Google OAuth 로그인' })
  @ApiQuery({ name: 'state', required: false, description: '상태값: 추가로 처리할 내용에 대한 쿼리 파라미터: 현재는 default 로 처리' })
  async googleLogin(@Req() req: any, @Res() res: Response, @Query('state') state?: string) {
    return await new Promise((resolve, reject) => {
      // 세션 관련 코드 제거
      passport.authenticate('google', {
        scope: ['email', 'profile', 'https://www.googleapis.com/auth/spreadsheets.readonly', 'https://www.googleapis.com/auth/drive.file'],
        accessType: 'offline', // refresh token 발급을 위해 필요
        prompt: 'consent',
        state: state || 'default'
      })(req, res, (err: any) => {
        if (err) reject(err);
        else resolve({ message: 'Authentication started' });
      });
    });
  }

  @Get('callback')
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Google OAuth 로그인 콜백' })
  @Header('Cache-Control', 'no-store')
  async googleCallback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    /*
    from google callback
    {
      state: 'http://localhost:3001/',
      code: '4/tewtet_nOB0hE8Qu0_Lc1W3g',
      scope: 'email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email ope
    nid',
      authuser: '0',
      prompt: 'none'
    }
    */
    return new Promise((resolve, reject) => {
      passport.authenticate('google', { session: false }, async (err: any, user: any) => {
        if (err) {
          // OAuth 오류 상세 처리
          if (err.code === 'invalid_grant') {
            console.error('Google OAuth invalid_grant error:', err);
            // locale 은 영어로 처리
            const redirectUrl = (process.env.INVALID_AUTH_CALLBACK_URL || '').replace('[origin]', decodeURIComponent(req.query.state)) + "?loginStatus=error"; //'https://webinow.co.kr';
            res.redirect(302, redirectUrl);
            resolve({ message: 'Token expired, redirecting to login' });
            return;
          }

          reject(err);
          return;
        }

        if (!user) {
          reject(new BadRequestException({
            message: 'Google OAuth authentication failed',
            code: '1303',
          }));
          return;
        }

        try {
          const result = await this.googleStrategy.validate(
            user.accessToken,
            user.refreshToken,
            user.profile,
          );

          const mailFlowAccessToken = await this.authService.generateAccessToken({
            userGuid: result.user.guid,
            refreshToken: result.refreshToken,
          });

          

          // 세션 대신 쿼리 파라미터로 origin 처리
          const origin = (decodeURIComponent(req.query.state) || 'default').replace(/\/$/, '');
          const redirectUrl = (process.env.AUTH_CALLBACK_URL || 'http://localhost:3000').replace('[origin]', origin);

          if (result?.accessToken) {
            const url = new URL(redirectUrl);

            // 토큰들을 하나의 객체로 결합하고 암호화
            const tokenData = {
              mftoken: mailFlowAccessToken,
              accessToken: result.accessToken,
              refreshToken: result.refreshToken,
              loginStatus: 'success',
              timestamp: Date.now() // 추가 보안을 위한 타임스탬프
            };

            console.log(mailFlowAccessToken);

            // Base64 인코딩 (간단한 방법)
            const encodedData = Buffer.from(JSON.stringify(tokenData)).toString('base64');
            url.searchParams.set('key', encodedData);
            res.redirect(302, url.toString());
          } else {
            // 토큰이 없는 경우 (신규 사용자 등)
            const mainHomeUrl = (process.env.MAIN_HOME_URL || 'http://localhost:3000');
            res.redirect(302, mainHomeUrl);
          }

        } catch (error) {
          console.error('Social signin error:', error);
          reject(error);
        }
      })(req, res);
    });
  }
}