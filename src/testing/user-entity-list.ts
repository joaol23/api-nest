import { Role } from "@/enums/role.enum";
import { User } from "@/modules/user/entity/user.entity";
import { genSalt, hash } from "bcrypt";

export const userEntityList: User[] = [
    {
        birthAt: new Date("2000-01-01"),
        email: "test@example.com",
        name: "John Smith",
        password: "123456",
        role: Role.Admin,
    },
];
