import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import type { ICreateUser } from 'src/database/dtos/user-dtos';
import { User } from 'src/database/entities/user';
import bcrypt from "bcrypt"
import { get } from 'http';

@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) { }

    @Post("create")
    async create(@Body() body: ICreateUser) {

        try {
            const newUser = new User()
            newUser.name = body.name
            newUser.email = body.email
            newUser.role = body.role

            const salt = bcrypt.genSaltSync(10)
            newUser.password = bcrypt.hashSync(body.password, salt)

            await this.service.createUser(newUser)

            return { message: "Usuario criado com sucesso" }

        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
    @Delete(":id")
    async remove(@Param("id") id: number) {
        try {

            const UserExist = await this.service.getUser(null, id)
            if (UserExist) {
                await this.service.removeUser(id)
                return { message: "Usuario removido" }
            } else {
                throw new HttpException("Usuario não encontrado", HttpStatus.NOT_FOUND)
            }

        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
    @Get('customers')
    async getAllCustomers() {
        try {
            console.log("chamou essa request")
            return await this.service.getAllCustomers();
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
