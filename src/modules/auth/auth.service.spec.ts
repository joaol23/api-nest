import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { userRepositoryMock } from "@/testing/user-repository.mock";
import { jwtServiceMock } from "@/testing/jwt.service.mock";
import { userServiceMock } from "@/testing/user.service.mock";
import { mailerServiceMock } from "@/testing/mailer.service.mock";
import { userEntityList } from "@/testing/user-entity-list";
import { accessToken } from "@/testing/access-token.mock";
import { payload } from "@/testing/jwt-payload.mock";
import { resetToken } from "@/testing/reset-token.mock";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";

describe("Auth", () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                userRepositoryMock,
                jwtServiceMock,
                userServiceMock,
                mailerServiceMock,
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    test("Validar a definiçao", () => {
        expect(authService).toBeDefined();
    });

    test("Teste criação de Token", async () => {
        const result = await authService.createToken(userEntityList[0]);
        expect(result).toEqual(accessToken);
    });

    test("Teste usar Token", async () => {
        const result = authService.checkToken(accessToken);
        expect(result).toEqual(payload);
    });

    test("Teste valido Token", async () => {
        const result = authService.isValidToken(accessToken);
        expect(result).toEqual(true);
    });

    test("Testando login", async () => {
        const result = await authService.login("teste@example.com", "12345678");
        expect(result).toEqual(accessToken);
    });

    test("Testando forget", async () => {
        const result = await authService.forget("teste@example.com");
        expect(result).toEqual(true);
    });

    test("Testando reset", async () => {
        const result = await authService.resetPassword("12345678", resetToken);
        expect(result).toEqual(accessToken);
    });

    test("Testando register", async () => {
        const authRegisterDTO: AuthRegisterDTO = {
            name: "teste",
            email: "teste@example.com",
            password: "123456",
        };
        const result = await authService.register(authRegisterDTO);
        expect(result).toEqual(accessToken);
    });
});
