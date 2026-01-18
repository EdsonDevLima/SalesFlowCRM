import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { User } from "./user";
import { Product } from "./product";

@Entity()
export class Sale {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    created_at: string

    @ManyToOne(() => User, user => user.sales)
    user: User

    @ManyToMany(() => Product, { cascade: true })
    @JoinTable()
    products: Product[]

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number

    @Column({ type: 'enum', enum: ['canceled', 'shipped', 'pending'], default: 'pending' })
    status: "canceled" | "shipped" | "pending"
}