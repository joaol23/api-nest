import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "@/guards/auth.guard";
import { AuthController } from "./auth.controller";
import { authServiceMock } from "@/testing/auth-service.mock";
import { fileServiceMock } from "@/testing/file-service.mock";
import { AuthLoginDTO } from "./DTO/auth-login.dto";
import { accessToken } from "@/testing/access-token.mock";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";
import { AuthForgetDTO } from "./DTO/auth-forget.dto";
import { AuthResetDTO } from "./DTO/auth-reset.dto";
import { resetToken } from "@/testing/reset-token.mock";
import { userEntityList } from "@/testing/user-entity-list";
import { getPhoto } from "@/testing/photo.mock";
describe("UserService", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [authServiceMock, fileServiceMock],
            controllers: [AuthController],
        })
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();

        authController = module.get<AuthController>(AuthController);
    });

    describe("Guards", () => {
        test("Guard Auth aplicado", () => {
            const guards = Reflect.getMetadata(
                "__guards__",
                AuthController.prototype.photo,
            );
            expect(guards.length).toEqual(1);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });

        test("Guard Role aplicado", () => {
            const guards = Reflect.getMetadata(
                "__guards__",
                AuthController.prototype.photos,
            );

            expect(guards.length).toEqual(1);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
        });
    });

    test("Login method", async () => {
        const data: AuthLoginDTO = {
            email: "test@example.com",
            password: "123456",
        };
        const result = await authController.login(data);
        expect(result).toEqual({
            access_token: accessToken,
        });
    });

    test("Register method", async () => {
        const data: AuthRegisterDTO = {
            name: "teste",
            email: "test@example.com",
            password: "123456",
        };
        const result = await authController.register(data);
        expect(result).toEqual({
            access_token: accessToken,
        });
    });

    test("Forget method", async () => {
        const data: AuthForgetDTO = {
            email: "test@example.com",
        };
        const result = await authController.forget(data);
        expect(result).toEqual({
            success: true,
        });
    });

    test("Reset method", async () => {
        const data: AuthResetDTO = {
            password: "123456",
            token: resetToken,
        };
        const result = await authController.reset(data);
        expect(result).toEqual({
            access_token: accessToken,
        });
    });

    test("UploadPhoto method", async () => {
        const photo = await getPhoto();
        const result = await authController.photo(userEntityList[0], photo);
        expect(result).toEqual({
            success: true,
            path: "",
        });
    });
});
