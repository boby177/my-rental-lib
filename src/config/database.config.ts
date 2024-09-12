import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';

dotenv.config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: +process.env.DB_PORT,
  host: process.env.DB_HOST,
  entities: [
    'dist/**/*.entity{.ts,.js}',
    'dist/**/**/entities/*.entity{.ts,.js}',
    'dist/**/**/**/entities/*.entity{.ts,.js}',
    'dist/**/**/**/**/entities/*.entity{.ts,.js}',
  ],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  seeds: ['src/database/seeds/*{.ts,.js}'],
  seedTracking: true,
  synchronize: process.env.DB_SYNCRONIZE === 'true',
  cache: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

dataSource.initialize().then(async () => {
  await dataSource.query("SET TIME ZONE 'Asia/Jakarta'");

  if (process.env.DB_SEEDER === 'true') {
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
  }
});
