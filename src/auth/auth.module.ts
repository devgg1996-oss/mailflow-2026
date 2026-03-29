import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { GoogleController } from './controller/google.controller';
import { GoogleStrategy } from './service/google.strategy';

@Module({
  controllers: [AuthController, GoogleController],
  providers: [AuthService, GoogleStrategy]
})
export class AuthModule { }
