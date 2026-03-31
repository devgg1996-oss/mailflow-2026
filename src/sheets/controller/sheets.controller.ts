import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SheetsService } from '../service/sheets.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetSheetsRequestDto } from '../dto/request';

@Controller('sheets')
export class SheetsController {
    constructor(private readonly sheetsService: SheetsService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '구글폼 응답시트 가져오기' })
    @ApiBody({ type: GetSheetsRequestDto })
    @ApiResponse({ status: 200, description: '구글폼 응답시트 가져오기' })
    async getSheets(@Req() req: any, @Body() body: GetSheetsRequestDto) {
        const user = req.user;
        if (!user) { throw new UnauthorizedException('Unauthorized'); }

        const sheets = await this.sheetsService.getSheets(user.userGuid, body);
        return { message: 'Success', data: sheets };
    }
}
