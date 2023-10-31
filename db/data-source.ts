import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity.js', 'dist/**/**/*.entity.js'],
  logging: true,
  migrationsRun: true,
  synchronize: true,
  migrations: ['dist/db/migrations/*.js'],
  ssl: {
    rejectUnauthorized: false,
  },
  // ssl: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
