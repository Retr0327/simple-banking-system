import { ConfigModule } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config, { env } from '@/configs';
import { entities } from './entities';
import { repositories } from './repositories';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: env.mysqlHost,
      port: 3306,
      username: env.mysqlUser,
      password: env.mysqlPassword,
      database: env.mysqlDb,
      entities,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...repositories],
  exports: [TypeOrmModule, ...repositories],
})
export class MySQLModule {}
