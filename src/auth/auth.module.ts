import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { GoogleController } from './controller/google.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.stratogy';
import { BaseUsersService } from 'src/users/service/base-users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.registerAsync({
    useFactory: () => ({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  })],
  controllers: [AuthController, GoogleController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, BaseUsersService]
})
export class AuthModule { }
