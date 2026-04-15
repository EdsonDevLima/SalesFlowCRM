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
    @Column()
    category:string
    @Column()
    amount:number
    @Column()
    status:string
    @Column()
    isPromotion:boolean
    @ManyToMany(() => Sale, sale => sale.products)
    sales: Sale[]
    @CreateDateColumn()
    createdAt: Date;
    @Column({ type: 'varchar', length: 255, nullable: true })
    image?:string | undefined
    
}