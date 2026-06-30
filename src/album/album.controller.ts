import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors, Logger, UseGuards } from "@nestjs/common";
import { AlbumService } from "./album.service";
import { CreateAlbumDto } from "./dto/create-album.dto";
import * as mongoose from "mongoose";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guards/auth-jwt.guard";
import { RolesGuard } from "src/auth/guards/auth-role.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";

@Controller("/albums")
export class AlbumController {
    constructor(private albumService: AlbumService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.ARTIST)
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'cover', maxCount: 1 },
    ]))
    create(@Body() createDto: CreateAlbumDto, @UploadedFiles() files){
        const {cover} = files;
        return this.albumService.create(createDto, cover[0]);
    }

    @Get("/search")
    search(@Query("query") query: string) {
        return this.albumService.search(query);
    }

    @Get(":id")
    getOne(@Param("id") id: mongoose.ObjectId) {
        return this.albumService.getOne(id);
    }

    @Get()
    getAll(@Query("limit") limit: number, @Query("offset") offset: number) {
        return this.albumService.getAll(limit, offset);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(":id")
    delete(@Param("id") id: mongoose.Types.ObjectId) {
        return this.albumService.delete(id);
    }
}