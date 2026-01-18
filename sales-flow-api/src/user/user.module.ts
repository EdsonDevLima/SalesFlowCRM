import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/database/entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  controllers:[UserController],
  imports: [TypeOrmModule.forFeature([User])],
  exports:[UserService]
})
export class UserModule { }
