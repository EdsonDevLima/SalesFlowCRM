export interface IUserDto {
    name: string
    password: string
    email: string
    role: "customer" | "admin"
}

export interface ICreateUser extends IUserDto {
    confirmPassword: string

}

export interface ILoginUser {
    email: string
    password: string
}