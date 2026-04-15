import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import type { ICreateUser, IUpdateUser } from 'src/database/dtos/user-dtos';
import { User } from 'src/database/entities/user';
import bcrypt from "bcrypt"
import { Adress } from 'src/database/entities/adress';


@Controller('user')
export class UserController {
    constructor(private readonly service: UserService) { }

    @Post("create")
    async create(@Body() body: ICreateUser) {

        try {
            const userExist = await this.service.getUser(body.email,null)
            if(userExist.user){
                 throw new HttpException(`Já existe um usuario com esse email.`, HttpStatus.BAD_REQUEST)
            }
            
            const newUser = new User()
            newUser.name = body.name
            newUser.email = body.email
            newUser.role = body.role
            newUser.cpf = body.cpf || "0000000000"
            
            const address = body.addresses[0] || {}
            if(address){
            newUser.adress = new Adress()
            newUser.adress.city = address.city
            newUser.adress.street = address.street
            newUser.adress.country = `Brasil`
            newUser.adress.state = address.state
            newUser.adress.number = address.number
            }

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
            return await this.service.getAllCustomers();
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Put("update/:id")
    async update(
    @Param("id") id: number,
    @Body() body: IUpdateUser
    ) {
    try {
        const result = await this.service.updateUser(Number(id), body);

        if (!result.sucess) {
        throw new HttpException(result.message, HttpStatus.NOT_FOUND);
        }

        return { message: result.message };

    } catch (error) {
        throw new HttpException(
        error instanceof Error ? error.message : "Erro interno",
        HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
    }
}
