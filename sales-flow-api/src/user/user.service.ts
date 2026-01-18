import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>) { }
    async createUser(User: User) {
        try {
            await this.repository.save(User)
        } catch (error) {
            throw Error(error)
        }


    }
    async removeUser(id: number) {
        try {
            const User = await this.repository.findOne({ where: { id } })
            if (User) {
                await this.repository.remove(User)
                return { sucess: true, message: "Cliente removido" }
            } else {
                return { sucess: false, message: "Cliente não encontrado" }
            }

        } catch (error) {
            throw Error(error)
        }
    }
    async updateUser(User: User) {
        try {
            const UserExist = await this.repository.findOne({ where: { id: User.id } })
            if (UserExist) {
                await this.repository.update({ id: UserExist.id }, {
                    name: UserExist.name,
                    email: UserExist.email,
                })
                return { sucess: true, message: "Cliente atualizado" }
            } else {
                return { sucess: false, message: "Cliente não encontrado" }
            }

        } catch (error) {
            throw Error(error)
        }
    }
    async getAllUser() {
        try {
            const items = await this.repository.find()
            return { items }

        } catch (error) {
            throw Error(error)
        }
    }
    async getAllCustomers() {
        try {
            const customers = await this.repository.find({ where: { role: 'customer' } });
            return { items: customers };
        } catch (error) {
            throw Error(error);
        }
    }
    async getUser(email: string | null, id: number | null) {
        try {
            let user: User | null = null

            if (id) {
                user = await this.repository.findOne({ where: { id } })
            }
            else if (email) {
                user = await this.repository.findOne({ where: { email } })
            }

            if (user == null) {
                return { sucess: false, message: "usuario não encontrado" }
            } else {
                return { sucess: true, user }
            }

        } catch (error) {
            throw Error(error)
        }
    }
}
