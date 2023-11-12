import {
    createParamDecorator,
    ExecutionContext,
} from "@nestjs/common";

export const ParamIdNumberDecorator = createParamDecorator(
    (_data: string, context: ExecutionContext) => {
        return Number(
            context.switchToHttp().getRequest().params.id,
        );
    },
);
