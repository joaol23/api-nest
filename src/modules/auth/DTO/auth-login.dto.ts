import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class AuthLoginDTO {
    @IsEmail()
    email: string

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
}