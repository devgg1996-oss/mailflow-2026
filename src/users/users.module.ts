import { Module } from '@nestjs/common';
import { BaseUsersService } from './service/base-users.service';

@Module({
  providers: [BaseUsersService],
  exports: [BaseUsersService]
})
export class UsersModule { }
