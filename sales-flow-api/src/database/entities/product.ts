import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn } from "typeorm";
import { Sale } from "./sale"; 

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number
    @Column()
    name: string
    @Column()
    price: string
    @Column()
    description: string
    @ManyToMany(() => Sale, sale => sale.products)
    sales: Sale[]
    @CreateDateColumn()
    createdAt: Date;
    
}