import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app/app.config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  // https://docs.nestjs.cn/8/openapi
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
