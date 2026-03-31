import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('logout')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({ status: 200, description: '로그아웃 성공' })
    async logout(@Req() req: any) {
        return this.authService.logout(req.user.userGuid);
    }
}
