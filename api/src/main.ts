import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { getLogLevels } from './common/utils/shared.utils';
import { AppModule } from './main/app.module';

const CORS_URL = process.env.CORS_URL ?? process.env.ENGINE_BASE_URL;
const DEFAULT_LEVEL = process.env.NODE_ENV === 'production' ? 1 : 4;
const LOG_LEVEL = process.env.LOG_LEVEL
  ? parseInt(process.env.LOG_LEVEL)
  : DEFAULT_LEVEL;

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
    logger: getLogLevels(LOG_LEVEL),
  });

  app.use(cookieParser());

  await app.listen(process.env.GATEWAY_PORT || 8081);
}
bootstrap();
