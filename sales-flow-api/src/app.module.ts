
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { Product } from './database/entities/product';
import { SalesModule } from './sales/sales.module';
import { User } from './database/entities/user';
import { Sale } from './database/entities/sale';
import { Adress } from './database/entities/adress';
import { UserModule } from './user/user.module';

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
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'), 
        database: configService.get<string>('DATABASE_NAME'),
        entities: [Product, User, Sale, Adress],
        synchronize: true,
        autoLoadEntities: true,
        logging: true, 
      }),
    }),
    ProductsModule,
    SalesModule,
    UserModule,
  ],
})
export class AppModule {}