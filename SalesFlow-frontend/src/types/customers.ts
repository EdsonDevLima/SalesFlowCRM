export interface ICustomer{
    id:number
    name: string
    password: string
    email: string
    role: "customer" | "admin"
    createdAt:string
}