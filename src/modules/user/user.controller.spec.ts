import { Test, TestingModule } from "@nestjs/testing";
import { userServiceMock } from "@/testing/user.service.mock";
import { UserController } from "./user.controller";
import { AuthGuard } from "@/guards/auth.guard";
import { RoleGuard } from "@/guards/role.guard";
import { createUserDto } from "@/testing/create-user-dto.mock";
import { userEntityList } from "@/testing/user-entity-list";
import { Role } from "@/enums/role.enum";
import { UpdateUserDto } from "./DTO/UpdateUserDto";
import { PatchUserDto } from "./DTO/PatchUserDto";

describe("UserService", () => {
    let userController: UserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [userServiceMock],
            controllers: [UserController],
        })
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .overrideGuard(RoleGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();

        userController = module.get<UserController>(UserController);
    });

    describe("Guards", () => {
        test("Guard Auth aplicado", () => {
            const guards = Reflect.getMetadata("__guards__", UserController);
            expect(guards.length).toEqual(2);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });

        test("Guard Role aplicado", () => {
            const guards = Reflect.getMetadata("__guards__", UserController);

            expect(guards.length).toEqual(2);
            expect(new guards[1]()).toBeInstanceOf(RoleGuard);
        });
    });

    test("Validar a definiçao", () => {
        expect(userController).toBeDefined();
    });

    test("Create method", async () => {
        const result = await userController.create(createUserDto);
        expect(result).toEqual(userEntityList[0]);
    });

    test("List method", async () => {
        const result = await userController.show();
        expect(result).toEqual(userEntityList);
    });

    test("Show method", async () => {
        const result = await userController.find(1);
        expect(result).toEqual(userEntityList[0]);
    });

    test("Update method", async () => {
        const data: UpdateUserDto = {
            birthAt: "2000-01-01",
            email: "test@example.com",
            name: "John Smith",
            password: "123456",
            role: Role.Admin,
        };
        const result = await userController.update(data, 1);
        expect(result).toEqual(userEntityList[0]);
    });

    test("Update partial method", async () => {
        const data: PatchUserDto = {
            role: Role.Admin,
        };
        const result = await userController.partialUpdate(data, 1);
        expect(result).toEqual(userEntityList[0]);
    });

    test("Delete method", async () => {
        const result = await userController.exclude(1);
        expect(result).toEqual({
            success: true,
        });
    });
});
