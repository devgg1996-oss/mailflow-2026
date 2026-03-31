import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BaseUsersService } from 'src/users/service/base-users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly baseUsersService: BaseUsersService, 
        private readonly jwtService: JwtService
    ) {}

    async logout(userGuid: string) {
        await this.baseUsersService.getUserByGuid(userGuid);
        return { message: 'Logout successful' };
    }

    async generateAccessToken(payload: any) {
        return this.jwtService.sign({
            ...payload,
        });
    }
}
