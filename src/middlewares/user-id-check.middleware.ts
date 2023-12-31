import {
    BadRequestException,
    NestMiddleware,
} from "@nestjs/common";
import { NextFunction } from "express";

export class UserIdCheckMiddleware
    implements NestMiddleware
{
    use(req: any, res: any, next: NextFunction) {
        if (
            isNaN(Number(req.params.id)) ||
            Number(req.params.id) <= 0
        ) {
            throw new BadRequestException(`ID inválido!`);
        }
        return next();
    }
}
