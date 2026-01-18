import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Adress } from "./adress";
import { Sale } from "./sale";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    email: string
    @Column()
    password: string
    @Column()
    role: string
    @OneToOne(() => Adress, adress => adress.id)
    adress?: Adress
    @OneToMany(() => Sale, sale => sale.user)
    sales: Sale[]
    @CreateDateColumn()
    createdAt: Date;

}