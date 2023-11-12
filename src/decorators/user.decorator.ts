import {
    createParamDecorator,
    ExecutionContext,
    NotFoundException,
} from "@nestjs/common";

export const User = createParamDecorator(
    (filter: string, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();

        if (request.user) {
            const user = request.user;
            if (filter) {
                return user[filter];
            }
            return user;
        }

        throw new NotFoundException("Usuário não encontrado!");
    },
);
