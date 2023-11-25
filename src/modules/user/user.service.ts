import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./DTO/CreateUserDto";
import { UpdateUserDto } from "./DTO/UpdateUserDto";
import { PatchUserDto } from "./DTO/PatchUserDto";
import { genSalt, hash } from "bcrypt";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create({
        email,
        name,
        password,
        birthAt,
        role,
    }: CreateUserDto): Promise<User> {
        if (await this.usersRepository.exist({
            where: {
                email
            }
        })) {
            throw new BadRequestException("E-mail já cadastrado.");
        }

        const newPassword = await hash(password, await genSalt());
        const data = {
            email: email,
            name: name,
            password: newPassword,
            birthAt: birthAt ? new Date(birthAt) : undefined,
            role: role,
        };

        return await this.usersRepository.save(data);
    }

    async list(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async show(id: number): Promise<User> {
        await this.exists(id);
        return await this.usersRepository.findOneByOrFail({ id });
    }

    async update(
        { email, name, password, birthAt, role }: UpdateUserDto,
        id: number,
    ): Promise<User> {
        await this.exists(id);
        const newPassword = await hash(password, await genSalt());

        await this.usersRepository.update(id, {
            email,
            name,
            password: newPassword,
            birthAt: birthAt ? new Date(birthAt) : undefined,
            role,
        });
        return this.show(id);
    }

    async updatePartial(data: PatchUserDto, id: number) {
        await this.exists(id);

        let newBirthAt;
        if (data.birthAt) {
            newBirthAt = new Date(data.birthAt);
        }

        await this.usersRepository.update(id, {
            ...data,
            birthAt: newBirthAt ?? undefined,
        });
        return this.show(id);
    }

    async delete(id: number) {
        await this.exists(id);
        return this.usersRepository.delete({ id });
    }

    async exists(id: number) {
        if (!(await this.usersRepository.countBy({ id }))) {
            throw new NotFoundException(`Usuario ${id} não existe`);
        }
    }
}
