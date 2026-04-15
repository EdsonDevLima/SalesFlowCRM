import { Column, Entity, OneToOne, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, JoinColumn } from "typeorm";
import { Adress } from "./adress";
import { Sale } from "./sale";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    cpf?:string
    @Column()
    email: string
    @Column()
    password: string
    @Column()
    role: string
    @OneToOne(() => Adress, (adress) => adress.user, { cascade: true })
    @JoinColumn()
    adress: Adress | null;
    @OneToMany(() => Sale, sale => sale.user)
    sales: Sale[]
    @CreateDateColumn()
    createdAt: Date;

}