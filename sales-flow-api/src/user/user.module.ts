import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/database/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { Adress } from 'src/database/entities/adress';

@Module({
  providers: [UserService],
  controllers:[UserController],
  imports: [TypeOrmModule.forFeature([User,Adress])],
  exports:[UserService]
})
export class UserModule { }
