import { Injectable } from '@nestjs/common';
import { ILoginUser, IRegisterUser, payloadJwt } from 'src/database/dtos/user-dtos';
import { UserService } from 'src/user/user.service';
import bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/entities/user';

@Injectable()
export class AuthService {
    constructor(private readonly service: UserService, private jwtService: JwtService) { }
    async authenticateUser(userLogin: ILoginUser) {
        const { user } = await this.service.getUser(userLogin.email, null)
        if (user) {

            const checkPassword = await bcrypt.compare(userLogin.password, user.password)
            if (!checkPassword) {
                return { sucess: false, message: "Senha incorreta" }
            } else {

                const payloadToken:payloadJwt = {
                    role: user.role,
                    email: user.email,
                    sub: user.id
                }

                const token =  this.jwtService.sign(payloadToken,{secret:process.env.SECRET_JWT})
                return { sucess: true, token }

            }
        }
    }
    async RegisterUser(userLogin: IRegisterUser){
    const userExist = await this.service.getUser(userLogin.email, null)
    if(userExist.user){
        return { sucess: false, message:"Já existe um usuario com esses dados." }
    }
    if(userLogin.password !== userLogin.confirmPassword){
        return { sucess: false, message:"Confirmação de senha incorreta" }
    }       

    const newUser = new User()
    newUser.name = userLogin.name
    newUser.email = userLogin.email
    newUser.password = await bcrypt.hash(userLogin.password, 10) 
    newUser.cpf = "00000000"
    newUser.role = "admin"

    try{
        await this.service.createUser(newUser)

                const payloadToken:payloadJwt = {
                    role: newUser.role,
                    email: newUser.email,
                    sub: newUser.id
                }
        const token = this.jwtService.sign(payloadToken,{secret:process.env.SECRET_JWT}) 

        return {sucess: true, token, message:"Usuario criado"}
    }catch(error){
        throw new Error(`${error}`) 
    }
}
     async verifyToken(token: string) {
        try{
          const payload:payloadJwt = this.jwtService.verify(token,{secret:process.env.SECRET_JWT})

          const userExist = await this.service.getUser(payload.email, null)  

        if (userExist.user && payload.role == userExist.user?.role) {
             return true
         } else {
             return false
         }
        }
        
        catch(error){
                throw new Error(`${error}`)
        }
         
     }

}
