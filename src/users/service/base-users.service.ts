import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BaseUsersService {
    constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

    async createUser(userData: any) {
        try {   
            const user = await this.prisma.user.create({
            data: userData,
        });

        return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async upsertUser(email: string, updateData: any, createData: any) {    
        try {
            const user = await this.prisma.user.upsert({
                where: { email },
                update: updateData,
                create: createData,
            });
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUserByEmail(email: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { email }
            });
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getUserByGuid(guid: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: { guid }
            });
            return user;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}