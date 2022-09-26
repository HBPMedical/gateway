import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLError } from 'graphql';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module';
import authConfig from '../config/auth.config';
import cacheConfig from '../config/cache.config';
import dbConfig from '../config/db.config';
import { EngineModule } from '../engine/engine.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.defaults'],
      load: [dbConfig, cacheConfig, authConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      cache: 'bounded',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: [/http:\/\/localhost($|:\d*)/, /http:\/\/127.0.0.1($|:\d*)/],
      },
      formatError: (error: GraphQLError) => {
        const extensions = {
          code: error.extensions.code,
          status:
            error.extensions?.response?.statusCode ??
            error.extensions.exception.status,
          message:
            error.extensions?.response?.message ??
            error.extensions?.exception?.message,
        };

        return { ...error, extensions: { ...error.extensions, ...extensions } };
      },
    }),
    EngineModule.forRoot({
      type: process.env.ENGINE_TYPE,
      baseurl: process.env.ENGINE_BASE_URL,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ...config.get('database'),
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: process.env.NODE_ENV !== 'dev',
        synchronize: process.env.NODE_ENV === 'dev',
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ExperimentsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
