import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm"
import { conn } from './config/conn';
@Module({
    imports: [TypeOrmModule.forRoot(conn)]
})
export class DatabaseModule { }
