import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EngineModule } from 'src/engine/engine.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.defaults'],
    }),
    EngineModule.forRootAsync({
      type: process.env.ENGINE_TYPE,
      baseurl: process.env.ENGINE_BASE_URL,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
