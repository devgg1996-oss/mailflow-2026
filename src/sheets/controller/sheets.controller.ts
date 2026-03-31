import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SheetsService } from '../service/sheets.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RegisterSheetsRequestDto } from '../dto/request';

@Controller('sheets')
export class SheetsController {
    constructor(private readonly sheetsService: SheetsService) {}

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '구글시트 등록' })
    @ApiBody({ type: RegisterSheetsRequestDto })
    @ApiResponse({ status: 200, description: '구글시트 등록' })
    async registerSheets(@Req() req: any, @Body() body: RegisterSheetsRequestDto) {
        const user = req.user;
        if (!user) { throw new UnauthorizedException('Unauthorized'); }

        const sheets = await this.sheetsService.registerSheets(user.userGuid, body);
        return { message: 'Success', data: sheets };
    }

    @Get(':sheetId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '구글시트 응답 상세 조회' })
    @ApiParam({ name: 'sheetId', description: '구글시트 ID' })
    async getSheetDetails(@Req() req: any, @Param('sheetId') sheetId: string) {
        const user = req.user;
        if (!user) { throw new UnauthorizedException('Unauthorized'); }

        const sheetDetails = await this.sheetsService.getSheetDetails(user.userGuid, sheetId);
        return { message: 'Success', data: sheetDetails };
    }
}
