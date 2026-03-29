import { Injectable } from "@nestjs/common";
import { Strategy } from "passport-google-oauth20";
import { PrismaService } from "src/prisma/prisma.service";
import { ulid } from "ulid";
import { Provider } from "src/utils";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly prismaService: PrismaService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['email', 'profile', 'https://www.googleapis.com/auth/script.projects', 'https://www.googleapis.com/auth/drive.file'],
            accessType: 'offline',
            prompt: 'consent',
        } as any);
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const { name, emails } = profile;

        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
            refreshToken,
        };

        await this.prismaService.user.create({
            data: {
                guid: ulid(),
                name: `${name.givenName} ${name.familyName}`,
                email: user.email,
                provider: Provider.GOOGLE,
                providerId: profile.id,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
                lastLoginAt: new Date(),
            },
        });

        return {
            accessToken,
            refreshToken,
            profile,
        };
    }
}