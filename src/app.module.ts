import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from './configs';
import { controllers } from './controllers';
import { MySQLModule } from './libs/mysql';
import { services } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
      cache: true,
    }),
    MySQLModule,
  ],
  controllers,
  providers: [...services],
})
export class AppModule {}
