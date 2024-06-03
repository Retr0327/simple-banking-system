import { DataSource } from 'typeorm';
import { env } from '@/configs';

const dataSource = new DataSource({
  type: 'mysql',
  host: env.mysqlHost,
  port: 3306,
  username: env.mysqlUser,
  password: env.mysqlPassword,
  database: env.mysqlDb,
  synchronize: false,
  entities: ['src/libs/mysql/entities/*.ts'],
  migrationsTableName: '_Migration',
  migrations: ['typeorm/migrations/**/*.ts'],
});

export default dataSource;
