import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "@modules/user/user.module";
import { FileModule } from "@modules/file/file.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@modules/user/entity/user.entity";

@Module({
    imports: [
        JwtModule.register({
            secret: String(process.env.SECRET_JWT),
        }),
        forwardRef(() => UserModule),
        FileModule,
        TypeOrmModule.forFeature([User])
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
