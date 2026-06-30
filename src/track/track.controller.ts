import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors, Logger } from "@nestjs/common";
import { TrackService } from "./track.service";
import { CreateTrackDto } from "./dto/create-track.dto";
import * as mongoose from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { AddTrackDto } from "./dto/add-track.dto";

@Controller("/tracks")
export class TrackController {
    constructor(private trackService: TrackService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'audio', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
    ]))
    create(@Body() createDto: CreateTrackDto, @UploadedFiles() files){
        const {audio, cover} = files;

        return this.trackService.create(createDto, audio[0], cover[0]);
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

    @Delete(":id")
    delete(@Param("id") id: mongoose.Types.ObjectId) {
        return this.trackService.delete(id);
    }
    
    @Post("/comments")
    addComment(@Body() dto: CreateCommentDto) {
        return this.trackService.addComment(dto);
    }

    @Delete("/comments/:id")
    deleteComment(@Param("id") id: mongoose.Types.ObjectId) {
        return this.trackService.deleteComment(id);
    }

    @Post("/albums/:id")
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'audio', maxCount: 1 },
    ]))
    addTrackToAlbum(@Param("id") id: mongoose.Types.ObjectId, addTrackDto: AddTrackDto, @UploadedFiles() files){
        const {audio, cover} = files;

        return this.trackService.addTrackToAlbum(id, addTrackDto, audio[0]);
    }

   @Post("/listen/:id") 
   listen(@Param("id") id: mongoose.Types.ObjectId) {
    return this.trackService.listen(id);
   }
}