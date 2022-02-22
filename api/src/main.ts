import { NestFactory } from '@nestjs/core';
import { AppModule } from './main/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      origin: [/http:\/\/localhost($|:\d*)/, /http:\/\/127.0.0.1($|:\d*)/],
    },
  });
  await app.listen(process.env.GATEWAY_PORT);
}
bootstrap();
