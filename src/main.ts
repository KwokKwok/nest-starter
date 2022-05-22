import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app/app.config';

console.log(
  `NODE_ENV: ${AppConfig.ENV}, IS_DEV_MODE: ${AppConfig.IS_DEV_MODE}`,
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // 跨域配置参数 https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    origin: ['http://localhost:3002'],
  });
  await app.listen(3000);
}
bootstrap();
