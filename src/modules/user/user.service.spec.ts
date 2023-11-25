import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { userRepositoryMock } from "@/testing/user-repository.mock";
import { CreateUserDto } from "./DTO/CreateUserDto";
import { Role } from "@/enums/role.enum";
import { userEntityList } from "@/testing/user-entity-list";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UpdateUserDto } from "./DTO/UpdateUserDto";
import { PatchUserDto } from "./DTO/PatchUserDto";
import { createUserDto } from "@/testing/create-user-dto.mock";

describe("UserService", () => {
    let userService: UserService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, userRepositoryMock],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(User));
    });

    test("Validar a definiçao", () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe("Create", () => {
        test("method create", async () => {
            jest.spyOn(userRepository, "exist").mockResolvedValueOnce(false);

            const result = await userService.create(createUserDto);
            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe("Read", () => {
        test("method list", async () => {
            const result = await userService.list();

            expect(result).toEqual(userEntityList);
        });

        test("method list", async () => {
            const result = await userService.show(1);

            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe("Update", () => {
        test("method update", async () => {
            const data: UpdateUserDto = {
                birthAt: "2000-01-01",
                email: "test@example.com",
                name: "John Smith",
                password: "123456",
                role: Role.Admin,
            };
            const result = await userService.update(data, 1);

            expect(result).toEqual(userEntityList[0]);
        });

        test("method patch", async () => {
            const data: PatchUserDto = {
                role: Role.Admin,
            };
            const result = await userService.updatePartial(data, 1);

            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe("Delete", () => {
        test("method delete", async () => {
            const result = await userService.delete(1);

            expect(result).toEqual(true);
        });
    });
});
