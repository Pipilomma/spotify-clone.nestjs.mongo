import { Controller, Delete, Get, Param, Query, UseGuards } from "@nestjs/common";
import * as mongoose from "mongoose";
import { JwtAuthGuard } from "src/auth/guards/auth-jwt.guard";
import { UserService } from "./user.service";
import { RolesGuard } from "src/auth/guards/auth-role.guard";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";

@Controller("/users")
export class UserController {
    constructor(private userService: UserService) {}

    @Get(":id")
    getOne(@Param("id") id: string) {
        return this.userService.getOne(id);
    }

    @Get()
    getAll(@Query("limit") limit: number, @Query("offset") offset: number) {
        return this.userService.getAll(limit, offset);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    delete(@Param("id") id: mongoose.Types.ObjectId) {
        return this.userService.delete(id);
    }
}