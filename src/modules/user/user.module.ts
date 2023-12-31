import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
    forwardRef,
} from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserIdCheckMiddleware } from "@/middlewares/user-id-check.middleware";
import { AuthModule } from "@modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";

@Module({
    imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UserIdCheckMiddleware).forRoutes({
            path: "users/:id",
            method: RequestMethod.ALL,
        });
    }
}
