import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import dbConfiguration from './src/config/db.config';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: ['.env', '.env.defaults'],
  load: [dbConfiguration],
});

const ormconfig = {
  ...dbConfiguration(),
  entities: ['dist/**/*.entity.js', 'dist/**/*.model.js'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: false,
};

const connSource = new DataSource(ormconfig);

connSource.initialize();

export default connSource;
