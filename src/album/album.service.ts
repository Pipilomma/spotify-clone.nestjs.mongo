import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Album, AlbumDocument } from "./schemas/album.schema";
import { Model, ObjectId, Types } from "mongoose";
import { CreateAlbumDto } from "./dto/create-album.dto";
import { FileService } from "src/file/file.service";
import { FileToSaveType } from "../common/enums/fileType.enum"


@Injectable()
export class AlbumService {

    constructor(@InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
                private fileService: FileService) {}

    async create(dto: CreateAlbumDto, userId: string, artistName: string, cover): Promise<Album> {
        const coverPath = this.fileService.createFile(FileToSaveType.IMAGE, cover);
        const album = await this.albumModel.create({name: dto.name, artist: artistName, owner: userId, cover: coverPath});

        return album!;
    }

    async getOne(id: ObjectId): Promise<Album> {
        const album = await this.albumModel.findById(id).populate("tracks");

        if(!album) {
            throw new NotFoundException("album not found");
        }

        return album;
    }

    async getAll(limit = 10, offset = 0): Promise<Album[]> {
        const albums = await this.albumModel.find().skip(offset).limit(limit);

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
            return [];
        }

        return albums;
    }

    async delete(id: string, ownerId: string): Promise<Types.ObjectId> {
        const album = await this.albumModel.findOne({_id: id});

        if(!album) {
            throw new NotFoundException("album is not exists");
        }

        if (album.owner !== ownerId) {
            throw new ForbiddenException("don't have right to do this");
        }

        await this.albumModel.deleteOne({_id: id});

        return album._id;
    }
}