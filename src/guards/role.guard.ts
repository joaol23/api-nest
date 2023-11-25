import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "@decorators/role.decorator";
import { Role } from "@/enums/role.enum";
import { User } from "@modules/user/entity/user.entity";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const requiredRoles =
            this.reflector.getAllAndOverride<Role[]>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()],
            );

        if (!requiredRoles) {
            return true;
        }

        const { user }: { user: User } = context
            .switchToHttp()
            .getRequest();

        const rolesFiltered = requiredRoles.filter(
            (role) => user.role === role,
        );

        return rolesFiltered.length > 0;
    }
}
