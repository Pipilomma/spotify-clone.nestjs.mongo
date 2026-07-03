import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import * as mongoose from "mongoose";
import { JwtAuthGuard } from "src/auth/guards/auth-jwt.guard";
import { UserService } from "./user.service";
import { RolesGuard } from "src/auth/guards/auth-role.guard";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";

@Controller("/users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get("/profile")
    getProfile(@Req() req) {
        return this.userService.getById(req.user.id);
    }

    @Get(":id")
    getOne(@Param("id") id: string) {
        return this.userService.getById(id);
    }

    @Put("/profile/avatar")
    @UseInterceptors(FileFieldsInterceptor([
              { name: 'avatar', maxCount: 1 },
          ]))
    uploadAvatar(@Req() req, @UploadedFiles() files) {
        const {avatar} = files;

        return this.userService.uploadAvatar(req.user.id, avatar[0]);
    }

    @Put("/profile")
    changeUsername(@Body() updateDto: UpdateUserDto, @Req() req) {
        return this.userService.changeUsername(updateDto, req.user.id);
    }

    @Get()
    getAll(@Query("limit") limit: number, @Query("offset") offset: number) {
        return this.userService.getAll(limit, offset);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    delete(@Param("id") id: mongoose.Types.ObjectId) {
        return this.userService.delete(id);
    }

}