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
        // TODO: 로그아웃 처리
        /**
         * 방법 1: 블랙리스트 (Token Blacklist)a
         * 로그아웃 시 해당 JWT를 DB/Redis에 블랙리스트로 등록하고, 
         * JwtStrategy.validate()에서 블랙리스트 여부를 확인하는 방식.
         */
        return { message: 'Logout successful' };
    }

    async generateAccessToken(payload: any) {
        return this.jwtService.sign({
            ...payload,
        });
    }
}
