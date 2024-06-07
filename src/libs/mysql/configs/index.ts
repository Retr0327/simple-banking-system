import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from '@/configs';

export const typeOrmModuleOptions: TypeOrmModuleOptions =
  env.nodeEnv !== 'test'
    ? {
        type: 'mysql',
        name: 'default',
        host: env.mysqlHost,
        port: 3306,
        username: env.mysqlUser,
        password: env.mysqlPassword,
        database: env.mysqlDb,
      }
    : {
        type: 'better-sqlite3',
        name: 'default',
        database: ':memory:',
        synchronize: true,
        keepConnectionAlive: true,
      };
