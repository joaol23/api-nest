import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "./DTO/CreateUserDto";
import { UpdateUserDto } from "./DTO/UpdateUserDto";
import { PatchUserDto } from "./DTO/PatchUserDto";
import { UserService } from "./user.service";
import { ParamIdNumberDecorator } from "@decorators/param-id-number.decorator";
import { Roles } from "@decorators/role.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "@guards/role.guard";
import { AuthGuard } from "@guards/auth.guard";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async show() {
        return this.userService.list();
    }

    @Get(":id")
    async find(
        @ParamIdNumberDecorator()
        id: number,
    ) {
        return this.userService.show(id);
    }

    @Post()
    async create(
        @Body()
        { email, name, password, birthAt, role }: CreateUserDto,
    ) {
        return this.userService.create({
            email,
            name,
            password,
            birthAt,
            role,
        });
    }

    @Put(":id")
    async update(
        @Body()
        { email, name, password, birthAt, role }: UpdateUserDto,
        @ParamIdNumberDecorator()
        id: number,
    ) {
        return this.userService.update(
            {
                email,
                name,
                password,
                birthAt,
                role,
            },
            id,
        );
    }

    @Patch(":id")
    async partialUpdate(
        @Body()
        patchUserDto: PatchUserDto,
        @ParamIdNumberDecorator()
        id: number,
    ) {
        return this.userService.updatePartial(patchUserDto, id);
    }

    @Delete(":id")
    async exclude(
        @ParamIdNumberDecorator()
        id: number,
    ) {
        return this.userService.delete(id);
    }
}
