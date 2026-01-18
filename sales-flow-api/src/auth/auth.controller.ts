import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import type { ILoginUser, IUserDto } from 'src/database/dtos/user-dtos';
import { AuthService } from './auth.service';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post("login")
    async login(@Body() Body: ILoginUser) {
        try {
            const result = await this.authService.authenticateUser(Body)
            if (!result?.sucess) {
                throw new HttpException(`${result?.message}`, HttpStatus.BAD_REQUEST)
            }
            return result
        } catch (error) {
            throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
}
