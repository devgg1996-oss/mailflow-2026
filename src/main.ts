import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const BULL_QUEUE_NAME = 'sheets-response-email-queue';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.PORT ?? 3000);

  if (process.env.BULL_BOARD_DISABLED !== 'true') {
    const queue = app.get<Queue>(getQueueToken(BULL_QUEUE_NAME));
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');
    createBullBoard({
      queues: [new BullMQAdapter(queue)],
      serverAdapter,
    });
    app.use('/admin/queues', serverAdapter.getRouter());
  }

  app.enableCors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Cookie', "X-Device-Id"],
    optionsSuccessStatus: 204,
    exposedHeaders: ['Set-Cookie'], // 쿠키 노출 헤더 설정
  });

  // 1. Swagger 설정 구성
  const config = new DocumentBuilder()
    .setTitle('MailFlow 2026 API') // 프로젝트 제목
    .setDescription('구글폼 응답 기반 마케팅 이메일 자동화 서비스 API 문서') // 설명
    .setVersion('1.0') // 버전
    .addServer(`http://localhost:${port}`, '로컬')
    .addBearerAuth() // JWT 인증이 필요한 경우 추가
    .build();

  // 2. Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, config);

  // 3. Swagger UI 경로 설정 (예: http://localhost:3000/api-docs)
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
}
bootstrap();
