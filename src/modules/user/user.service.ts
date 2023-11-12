import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./DTO/CreateUserDto";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";
import { UpdateUserDto } from "./DTO/UpdateUserDto";
import { PatchUserDto } from "./DTO/PatchUserDto";
import { NotFoundError } from "rxjs";
import { genSalt, hash } from "bcrypt";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create({
        email,
        name,
        password,
        birthAt,
        role,
    }: CreateUserDto): Promise<User> {
        const newPassword = await hash(password, await genSalt());

        return await this.prisma.user.create({
            data: {
                email,
                name,
                password: newPassword,
                birthAt: birthAt ? new Date(birthAt) : null,
                role,
            },
        });
    }

    async list(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    async show(id: number): Promise<User | null> {
        await this.exists(id);
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async update(
        { email, name, password, birthAt, role }: UpdateUserDto,
        id: number,
    ): Promise<User> {
        await this.exists(id);
        const newPassword = await hash(password, await genSalt());

        return this.prisma.user.update({
            data: {
                email,
                name,
                password: newPassword,
                birthAt: birthAt ? new Date(birthAt) : null,
                role,
            },
            where: { id },
        });
    }

    async updatePartial(data: PatchUserDto, id: number) {
        await this.exists(id);

        let newBirthAt;
        if (data.birthAt) {
            newBirthAt = new Date(data.birthAt);
        }
        console.log(data);

        return this.prisma.user.update({
            data: {
                ...data,
                birthAt: newBirthAt ?? null,
            },
            where: {
                id,
            },
        });
    }

    async delete(id: number) {
        await this.exists(id);
        return this.prisma.user.delete({
            where: { id },
        });
    }

    async exists(id: number) {
        if (
            !(await this.prisma.user.count({
                where: {
                    id,
                },
            }))
        ) {
            throw new NotFoundException(`Usuario ${id} não existe`);
        }
    }
}
