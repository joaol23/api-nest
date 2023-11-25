import { Role } from "@/enums/role.enum";
import { User } from "@/modules/user/entity/user.entity";
import { genSalt, hash } from "bcrypt";

export const userEntityList: User[] = [
    {
        birthAt: new Date("2000-01-01"),
        email: "test@example.com",
        name: "John Smith",
        password:
            "$2b$10$2flu7s3f6pd8r9Wp08GQd.gxueB3ABo5GC3V9AaxuvLiNh9g9UMhq",
        role: Role.Admin,
        id: 1,
    },
];
