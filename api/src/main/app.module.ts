import { Module } from '@nestjs/common';
import { EngineModule } from 'src/engine/engine.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    EngineModule.forRootAsync({
      type: process.env.ENGINE_TYPE || "exareme"
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
