import {
    BadRequestException,
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AuthLoginDTO } from "./DTO/auth-login.dto";
import { AuthRegisterDTO } from "./DTO/auth-register.dto";
import { AuthForgetDTO } from "./DTO/auth-forget.dto";
import { AuthResetDTO } from "./DTO/auth-reset.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@guards/auth.guard";
import { User } from "@decorators/user.decorator";
import { User as UserModel } from "@prisma/client";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FileService } from "@modules/file/file.service";
import { join } from "path";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly fileService: FileService,
    ) {}

    @Post("login")
    async login(@Body() { email, password }: AuthLoginDTO) {
        return {
            access_token: await this.authService.login(email, password),
        };
    }

    @Post("register")
    async register(@Body() registerDto: AuthRegisterDTO) {
        return this.authService.register(registerDto);
    }

    @Post("forget")
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email);
    }

    @Post("reset")
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.resetPassword(password, token);
    }

    @UseGuards(AuthGuard)
    @Post("me")
    async me(@User() user: UserModel) {
        return {
            data: user,
        };
    }

    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(AuthGuard)
    @Post("photo")
    async photo(
        @User() user: UserModel,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: "image",
                    }),
                    new MaxFileSizeValidator({
                        maxSize: 1024 * 50,
                    }),
                ],
            }),
        )
        photo: Express.Multer.File,
    ) {
        try {
            const pathNewFile = join(
                __dirname,
                "..",
                "..",
                "..",
                "storage",
                "photos",
                `photo-${user.id}.png`,
            );
            await this.fileService.upload(photo, pathNewFile);

            return {
                success: true,
                path: pathNewFile,
            };
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    @UseInterceptors(FilesInterceptor("files"))
    @UseGuards(AuthGuard)
    @Post("photo")
    async photos(
        @User() user: UserModel,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return files;
    }
}