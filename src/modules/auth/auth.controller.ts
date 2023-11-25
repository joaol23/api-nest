import {
    BadRequestException,
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    Req,
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
import { UserDecorator } from "@decorators/user.decorator";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FileService } from "@modules/file/file.service";
import { join } from "path";
import { User } from "@modules/user/entity/user.entity";

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
        return {
            access_token: await this.authService.register(registerDto),
        };
    }

    @Post("forget")
    async forget(@Body() { email }: AuthForgetDTO) {
        return {
            success: await this.authService.forget(email),
        };
    }

    @Post("reset")
    async reset(@Body() { password, token }: AuthResetDTO) {
        return {
            access_token: await this.authService.resetPassword(password, token),
        };
    }

    @UseGuards(AuthGuard)
    @Post("me")
    async me(@UserDecorator() user: User, @Req() { tokenPayload }: any) {
        return {
            data: user,
            tokenPayload,
        };
    }

    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(AuthGuard)
    @Post("photo")
    async photo(
        @UserDecorator() user: User,
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
            const pathNewFile = await this.fileService.upload(
                photo,
                `photo-${user.id}.png`,
            );

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
        @UserDecorator() user: User,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        return files;
    }
}
