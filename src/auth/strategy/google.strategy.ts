import { Inject, Injectable } from "@nestjs/common";
import { Strategy } from "passport-google-oauth20";
import { ulid } from "ulid";
import { Provider } from "src/utils";
import { PassportStrategy } from "@nestjs/passport";
import { BaseUsersService } from "src/users/service/base-users.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(@Inject(BaseUsersService) private readonly baseUsersService: BaseUsersService) {
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

        const googleUser = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            accessToken,
            refreshToken,
        };

        const createData = {
            guid: ulid(),
            name: `${name.givenName} ${name.familyName}`,
            email: googleUser.email,
            provider: Provider.GOOGLE,
            providerId: profile.id,
            accessToken: googleUser.accessToken,
            refreshToken: googleUser.refreshToken,
            lastLoginAt: new Date(),
        }

        const updateData = {
            refreshToken: googleUser.refreshToken,
            lastLoginAt: new Date(),
        }

        const user =await this.baseUsersService.upsertUser(
            createData.email.toLowerCase(), 
            updateData,
            createData
        );

        return {
            accessToken,
            refreshToken,
            profile,
            user,
        };
    }
}