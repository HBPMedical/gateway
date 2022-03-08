import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path/posix';
import { AppModule } from './main/app.module';

const CORS_URL = process.env.CORS_URL ?? process.env.ENGINE_BASE_URL;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      credentials: true,
      origin: [
        /http:\/\/localhost($|:\d*)/,
        /http:\/\/127.0.0.1($|:\d*)/,
        CORS_URL,
      ],
    },
  });

  await app.listen(process.env.GATEWAY_PORT);
}
bootstrap();
