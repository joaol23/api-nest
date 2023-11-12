import { AuthService } from "@modules/auth/auth.service";
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    forwardRef,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { UserService } from "../modules/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly UserService: UserService,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { authorization } = request.headers;

        const barearToken = (authorization ?? "").split(
            " ",
        )[1];
        try {
            const dataUser =
                this.authService.checkToken(barearToken);

            request.tokenPayload = dataUser;
            request.user = await this.UserService.show(
                dataUser.id,
            );

            return true;
        } catch (e) {
            return false;
        }
    }
}
