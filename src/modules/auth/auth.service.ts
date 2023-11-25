import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";
import { UserService } from "@modules/user/user.service";
import { compare, genSalt, hash } from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/user/entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
    private issuer: string = "login";
    private audience: string = "users";

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailer: MailerService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
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
        const user = await this.usersRepository.findOneByOrFail({ email });

        if (!user) {
            throw new UnauthorizedException("E-mail e/ou senha incorretos.");
        }

        if (!(await compare(password, user.password))) {
            throw new UnauthorizedException("E-mail e/ou senha incorretos.");
        }

        return await this.createToken(user);
    }

    async forget(email: string): Promise<boolean> {
        const user = await this.usersRepository.findOneByOrFail({ email });

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
            await this.usersRepository.update(Number(id), {
                password: hashPassword,
            });
            return this.createToken(await this.userService.show(Number(id)));
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    async register(registerDto: AuthRegisterDTO) {
        delete registerDto.role;

        const newUser = await this.userService.create(registerDto);
        return await this.createToken(newUser);
    }
}
