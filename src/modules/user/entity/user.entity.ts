import { Role } from "src/enums/role.enum";
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn({
        unsigned: true,
    })
    id: number;

    @Column({
        length: 250,
    })
    name: string;

    @Column({
        length: 250,
        unique: true
    })
    email: string;

    @Column({
        length: 250,
    })
    password: string;

    @Column({
        type: "date",
        nullable: true,
    })
    birthAt?: Date;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @Column({
        default: Role.User
    })
    role: number;
}
