import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Swagger 설정 구성
  const config = new DocumentBuilder()
    .setTitle('MailFlow 2026 API') // 프로젝트 제목
    .setDescription('구글폼 응답 기반 마케팅 이메일 자동화 서비스 API 문서') // 설명
    .setVersion('1.0') // 버전
    .addTag('auth') // 태그 추가 (선택)
    .addTag('campaigns')
    .addBearerAuth() // JWT 인증이 필요한 경우 추가
    .build();

  // 2. Swagger 문서 생성
  const document = SwaggerModule.createDocument(app, config);

  // 3. Swagger UI 경로 설정 (예: http://localhost:3000/api-docs)
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
