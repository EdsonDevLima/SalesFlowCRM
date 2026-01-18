import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Adress {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    country: string
    @Column()
    city: string
    @Column()
    neighborhood: string
    @Column()
    complement: string
    @OneToOne(() => User, user => user.id)
    user: User
}