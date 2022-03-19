import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from 'src/auth/auth.module';
import { EngineModule } from 'src/engine/engine.module';
import { FilesModule } from 'src/files/files.module';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.defaults'],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      cors: {
        credentials: true,
        origin: [/http:\/\/localhost($|:\d*)/, /http:\/\/127.0.0.1($|:\d*)/],
      },
    }),
    EngineModule.forRoot({
      type: process.env.ENGINE_TYPE,
      baseurl: process.env.ENGINE_BASE_URL,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // type of our database
      host: process.env.DB_HOST, // database host
      port: parseInt(process.env.DB_PORT), // database host
      username: process.env.DB_USERNAME, // username
      password: process.env.DB_PASSWORD, // user password
      database: process.env.DB_NAME, // name of our database,
      autoLoadEntities: true, // models will be loaded automatically
      synchronize: process.env.NODE_ENV !== 'production', // your entities will be synced with the database(recommended: disable in prod)
    }),
    AuthModule,
    UsersModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
