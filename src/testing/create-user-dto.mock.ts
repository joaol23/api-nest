import { Role } from "@/enums/role.enum";
import { CreateUserDto } from "@/modules/user/DTO/CreateUserDto";

export const createUserDto: CreateUserDto = {
    birthAt: "2000-01-01",
    email: "test@example.com",
    name: "John Smith",
    password: "123456",
    role: Role.Admin,
};