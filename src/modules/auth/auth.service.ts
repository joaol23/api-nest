import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";
import { UserService } from "@modules/user/user.service";
import { compare, genSalt, hash } from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
    private issuer: string = "login";
    private audience: string = "users";

    constructor(
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
    ) {}

    async createToken(user: User): Promise<string> {
        return this.jwtService.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            {
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience,
            },
        );
    }

    checkToken(token: string): {
        id: number;
    } {
        try {
            const dataUser = this.jwtService.verify(token, {
                audience: this.audience,
                issuer: this.issuer,
            });
            return dataUser;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string): boolean {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }
    }

    async login(email: string, password: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException("E-mail e/ou senha incorretos.");
        }

        if (!(await compare(password, user.password))) {
            throw new UnauthorizedException("E-mail e/ou senha incorretos.");
        }

        return await this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException("E-mail está incorreto.");
        }

        const token = this.jwtService.sign(
            {
                id: user.id,
            },
            {
                expiresIn: "30 minutes",
                subject: String(user.id),
                issuer: "forget",
                audience: "users",
            },
        );

        await this.mailer.sendMail({
            subject: "Recuperação de Senha",
            to: "teste@hcode.com",
            template: "forget",
            context: {
                name: user.name,
                token,
            },
        });

        return true;
    }

    async resetPassword(newPassword: string, token: string) {
        try {
            const data = this.jwtService.verify(token, {
                audience: "forget",
                issuer: "users",
            });

            const id = data.id;
            const hashPassword = await hash(newPassword, await genSalt());
            const user = await this.prismaService.user.update({
                where: {
                    id: Number(id),
                },
                data: {
                    password: hashPassword,
                },
            });
            return this.createToken(user);
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async register(registerDto: AuthRegisterDTO) {
        const newUser = await this.userService.create(registerDto);

        return await this.createToken(newUser);
    }
}
