import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Album, AlbumDocument } from "./schemas/album.schema";
import { Connection, Model, ObjectId, Types } from "mongoose";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { FileService, FileType } from "src/file/file.service";

@Injectable()
export class AlbumService {
    private readonly logger = new Logger(AlbumService.name);

    constructor(@InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
                private fileService: FileService) {}

    async create(dto: CreateAlbumDto, cover): Promise<Album> {
        const coverPath = this.fileService.createFile(FileType.IMAGE, cover);
        const album = await this.albumModel.create({name: dto.name, artist: dto.artist, cover: coverPath});

        this.logger.log("created album");

        return album!;
    }

    async getOne(id: ObjectId): Promise<Album> {
        const album = await this.albumModel.findById(id).populate("tracks");

        if(!album) {
            this.logger.error("failed to get track");
            throw new NotFoundException("album not found");
        }

        this.logger.log("getted album");

        return album;
    }

    async getAll(limit = 10, offset = 0): Promise<Album[]> {
        const albums = await this.albumModel.find().skip(offset).limit(limit);

        if(!albums) {
            this.logger.error("failed to get all albums")
            throw new NotFoundException("failed to get all tracks");
        }

        this.logger.log("getted all albums");

        return albums;
    }  
    
    async search(query: string): Promise<Album[]> {
        const albums = await this.albumModel.find({
            $or: [
                {name: {$regex: query, $options: "i"}},
                {artist: {$regex: query, $options: "i"}}
            ],
        });


        if (albums.length === 0) {
            this.logger.error("album not found")
            return [];
        }

        this.logger.log("finded albums")

        return albums;
    }

    async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
        const album = await this.albumModel.findOneAndDelete({_id: id});

        if(!album) {
            this.logger.error("album not found")
            throw new NotFoundException("album is not exists");
        }

        this.logger.log("deleted album");

        return album._id;
    }
}