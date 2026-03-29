import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // @Global을 붙이면 다른 모듈에서 매번 import 하지 않아도 됩니다.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
