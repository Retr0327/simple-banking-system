import { ConfigModule } from '@nestjs/config';
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import env from '@/configs';
import { entities } from './entities';
import { repositories } from './repositories';
import { typeOrmModuleOptions } from './configs';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
      cache: true,
    }),
    TypeOrmModule.forRoot({ ...typeOrmModuleOptions, entities }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...repositories],
  exports: [TypeOrmModule, ...repositories],
})
export class MySQLModule {}
