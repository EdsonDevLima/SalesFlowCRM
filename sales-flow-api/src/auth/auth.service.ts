import { Injectable } from '@nestjs/common';
import { ILoginUser } from 'src/database/dtos/user-dtos';
import { UserService } from 'src/user/user.service';
import bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly service: UserService, private jwtService: JwtService) { }
    async authenticateUser(userLogin: ILoginUser) {
        const { user } = await this.service.getUser(userLogin.email, null)
        if (user) {

            const checkPassword = await bcrypt.compare(user.password, user.password)
            if (!checkPassword) {
                return { sucess: false, message: "Senha incorreta" }
            } else {
                const payloadToken = {
                    role: user.role,
                    email: user.email,
                    id: user.id
                }
                const token = await this.jwtService.sign(payloadToken)
                return { sucess: true, token }

            }
        }
    }
    async verifyToken(token: string) {
        const payload = this.jwtService.decode(token)
        const userExist = await this.service.getUser(payload.email, null)
        if (userExist) {
            return true
        } else {
            return false
        }
    }

}
