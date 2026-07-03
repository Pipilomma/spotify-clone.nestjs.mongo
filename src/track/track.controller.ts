import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors, Request, UseGuards, Req } from "@nestjs/common";
import { TrackService } from "./track.service";
import { CreateTrackDto } from "./dto/create-track.dto";
import * as mongoose from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { AddTrackDto } from "./dto/add-track.dto";
import { JwtAuthGuard } from "src/auth/guards/auth-jwt.guard";
import { RolesGuard } from "src/auth/guards/auth-role.guard";
import { Role } from "src/common/enums/role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";

@Controller("/tracks")
@UseGuards(JwtAuthGuard)
export class TrackController {
    constructor(private trackService: TrackService) {}

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.ARTIST)
    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'audio', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    create(@Body() createDto: CreateTrackDto, @UploadedFiles() files, @Request() req){
        const {audio, cover} = files;

        return this.trackService.create(createDto, req.user.id, req.user.username, audio[0], cover[0]);
    }

    @Get("/search")
    search(@Query("query") query: string) {
        return this.trackService.search(query);
    }

    @Get(":id")
    getOne(@Param("id") id: mongoose.ObjectId) {
        return this.trackService.getOne(id);
    }

    @Get()
    getAll(@Query("limit") limit: number, @Query("offset") offset: number) {
        return this.trackService.getAll(limit, offset);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ARTIST, Role.ADMIN)
    @Delete(":id")
    delete(@Param("id") id: mongoose.Types.ObjectId, @Request() req) {
        return this.trackService.delete(id, req.user.id);
    }
    
    @Post("/comments")
    addComment(@Body() dto: CreateCommentDto) {
        return this.trackService.addComment(dto);
    }

    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    @Delete("/comments/:id")
    deleteComment(@Param("id") id: mongoose.Types.ObjectId, @Request() req) {
        return this.trackService.deleteComment(id, req.user.id);
    }
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN, Role.ARTIST)
    @Post("/albums/:id")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'audio', maxCount: 1 },
    ]))
    addTrackToAlbum(@Param("id") id: mongoose.Types.ObjectId, @Body() addTrackDto: AddTrackDto, @Request() req, @UploadedFiles() files){
        const {audio, cover} = files;

        return this.trackService.addTrackToAlbum(id, addTrackDto, req.user.id, audio[0]);
    }

   @Post("/listen/:id") 
   listen(@Param("id") id: mongoose.Types.ObjectId, @Req() req) {
    return this.trackService.listen(id, req.user.id);
   }
}