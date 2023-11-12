import {
    OmitType,
    PartialType,
} from "@nestjs/mapped-types";
import { UpdateUserDto } from "./UpdateUserDto";

export class PatchUserDto extends PartialType(
    OmitType(UpdateUserDto, ["password"] as const),
) {}
