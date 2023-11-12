import { IsJWT, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class AuthResetDTO {
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minSymbols: 0,
        minUppercase: 0,
        minNumbers: 0,
        minLowercase: 0,
    })
    password: string

    @IsString()
    @IsJWT()
    token: string
}