import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUpdateUser } from 'src/database/dtos/user-dtos';
import { Adress } from 'src/database/entities/adress';
import { User } from 'src/database/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly repository: Repository<User>,@InjectRepository(Adress) private readonly addresRepository: Repository<Adress>) { }
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
    async updateUser(id: number, data: IUpdateUser) {
  try {
    const user = await this.repository.findOne({
      where: { id },
      relations: ["adress"],
    });

    if (!user) {
      return { sucess: false, message: "Usuario não encontrado" };
    }


    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.cpf = data.cpf ?? user.cpf;
    user.role = data.role ?? user.role;


    if (data.password) {
      user.password = data.password;
    }


    if (data.adress) {

      const addr = data.adress;

      if (user.adress) {

        user.adress.street = addr.street;
        user.adress.number = addr.number;
        user.adress.city = addr.city;   
        user.adress.state = addr.state;
        user.adress.zipCode = addr.zipCode;
      } else {

        const newAddress = this.addresRepository.create({
          ...addr,
          user: user,
        });

        user.adress = newAddress;
      }
    }

    await this.repository.save(user);

    return { sucess: true, message: "Cliente atualizado com sucesso" };

  } catch (error) {
    throw Error(error);
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

        const customers = await this.repository.find({
        where: { role: 'customer' },
        relations: ['adress'],
        });
       
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
