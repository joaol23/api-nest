import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "@modules/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { FileModule } from "@modules/file/file.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.SECRET_JWT,
        }),
        forwardRef(() => UserModule),
        PrismaModule,
        FileModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
