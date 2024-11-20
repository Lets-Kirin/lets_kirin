import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // CORS 설정
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: true,
  });

  // 서버 시작
  await app.listen(process.env.SERVER_PORT, '0.0.0.0');
  console.log(
    `Application is running on http://localhost:${process.env.SERVER_PORT}`,
  );
}
bootstrap();
