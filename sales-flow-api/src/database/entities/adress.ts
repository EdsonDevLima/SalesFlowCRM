import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Adress {
    @PrimaryGeneratedColumn()
    id: number
    @Column({nullable:true})
    country: string
    @Column({nullable:true})
    city: string
    @Column({nullable:true})
    street:string
    @Column({nullable:true})
    neighborhood: string
    @Column({nullable:true})
    state:string
    @Column({nullable:true})
    number: string
    @Column({nullable:true})
    zipCode:string
    @OneToOne(() => User, (user) => user.adress)
    user: User;
}