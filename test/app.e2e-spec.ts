import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AuthRegisterDTO } from "@/modules/auth/DTO/auth-register.dto";

describe("AppController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/ (GET)", () => {
        return request(app.getHttpServer())
            .get("/")
            .expect(200)
            .expect("Hello World!");
    });

    it("Registrar um novo usuario", async () => {
        const authRegisterDTO: AuthRegisterDTO = {
            name: "teste",
            email: "teste@example.com",
            password: "123456",
        };
        const response = await request(app.getHttpServer())
            .post("/auth/register")
            .send(authRegisterDTO)
            .expect(201);

        expect(typeof response.body.access_token).toEqual("string");
    });

    afterEach(() => {
        app.close();
    });
});
