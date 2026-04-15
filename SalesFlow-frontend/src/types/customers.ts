export interface ICustomer{
    id:number
    name: string
    password: string
    email: string
    role: "customer" | "admin"
    createdAt:string
    adress:IAddress
}

export interface IAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  zip: string;
};
