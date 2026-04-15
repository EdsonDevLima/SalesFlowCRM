export interface IUserDto {
    name: string
    password: string
    cpf?:string
    email: string
    role: "customer" | "admin"
}
export interface addressDTO {
  street: string;
  number: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ICreateUser extends IUserDto {
    
    addresses:addressDTO[]
    confirmPassword: string

}
export interface IUpdateUser extends IUserDto {
    
    adress:addressDTO

}
export interface ILoginUser {
    email: string
    password: string
}

export interface IRegisterUser {
    email: string
    password: string
    confirmPassword:string
    name:string
}

export interface payloadJwt {
  sub: number,
  email: string,
  role: string,
};
