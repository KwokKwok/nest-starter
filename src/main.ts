import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app/app.config';

console.log(
  `NODE_ENV: ${AppConfig.ENV}, IS_DEV_MODE: ${AppConfig.IS_DEV_MODE}`,
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
