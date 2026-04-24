import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notifications/notifications.module';

import { Product } from './database/entities/product';
import { User } from './database/entities/user';
import { Sale } from './database/entities/sale';
import { Adress } from './database/entities/adress';


import { PermissionsMiddleware } from './shared/middleware/permisions.middleware'; 
import { AuthMiddleware } from './shared/middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        entities: [Product, User, Sale, Adress],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
    }),

    ProductsModule,
    SalesModule,
    UserModule,
    AuthModule,
    NotificationModule,
  ]
})
export class AppModule implements NestModule { 
  configure(consumer: MiddlewareConsumer) {


    consumer
    .apply(AuthMiddleware)
    .forRoutes('*');

    consumer
      .apply(PermissionsMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}