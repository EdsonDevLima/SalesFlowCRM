import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../database/entities/sale';
import { Product } from '../database/entities/product';
import { User } from '../database/entities/user';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product, User])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
