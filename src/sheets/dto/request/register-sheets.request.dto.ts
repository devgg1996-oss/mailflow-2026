import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterSheetsRequestDto {
    @ApiProperty({ description: '구글시트 ID', example: '1218855195', required: true })
    @IsString()
    @IsNotEmpty()
    sheetId: string;
}
