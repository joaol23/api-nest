import { Module, forwardRef } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "@modules/user/user.module";
import { AuthModule } from "@modules/auth/auth.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule } from "@nestjs/config";
import { MailerModule } from "@nestjs-modules/mailer";
import { PugAdapter } from "@nestjs-modules/mailer/dist/adapters/pug.adapter";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: process.env.ENV === "test" ? '.env.test': '.env'
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60,
                    limit: 10,
                },
            ],
        }),
        forwardRef(() => UserModule),
        forwardRef(() => AuthModule),
        MailerModule.forRoot({
            transport: {
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "sven86@ethereal.email",
                    pass: "pHnbkBEn5kz82HKGHu",
                },
            },
            defaults: {
                from: '"João Teste" <sven86@ethereal.email>',
            },
            template: {
                dir: __dirname + "/templates",
                adapter: new PugAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        TypeOrmModule.forRoot({
            type: "mysql",
            host: "localhost",
            port: 3306,
            username: "teste",
            password: "password",
            database: process.env.DBNAME,
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: process.env.NODE_ENV !== "production",
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
