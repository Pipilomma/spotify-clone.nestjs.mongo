import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Track, TrackDocument } from "./schemas/track.schema";
import { Model, ObjectId, Types } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import { CreateTrackDto } from "./dto/create-track.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FileService, FileType } from "../file/file.service";
import { AddTrackDto } from "./dto/add-track.dto";
import { Album, AlbumDocument } from "src/album/schemas/album.schema";

@Injectable()
export class TrackService {
    private readonly logger = new Logger(TrackService.name);

    constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>,
                @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
                @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
                private fileService: FileService) {}

    async create(dto: CreateTrackDto, audio, cover): Promise<Track> {
        const auidoPath = this.fileService.createFile(FileType.AUDIO, audio);
        const coverPath = this.fileService.createFile(FileType.IMAGE, cover);
        const track = await this.trackModel.create({...dto, listens: 0, audio: auidoPath, cover: coverPath});

        this.logger.log("Created track")

        return track;
    }

    async getOne(id: ObjectId): Promise<Track> {
        const track = await this.trackModel.findById(id).populate("comments");

        if(!track) {
            this.logger.error("failed to get track");
            throw new NotFoundException("track not found");
        }

        this.logger.log("getted track");

        return track;
    }

    async getAll(limit = 10, offset = 0): Promise<Track[]> {
        const tracks = await this.trackModel.find().skip(offset).limit(limit);

        if(!tracks) {
            this.logger.error("failed to get all tracks")
            throw new NotFoundException("failed to get all tracks");
        }

        this.logger.log("getted all tracks");

        return tracks;
    }  
    
    async search(query: string): Promise<Track[]> {
        const tracks = await this.trackModel.find({
            $or: [
                {name: {$regex: query, $options: "i"}},
                {artist: {$regex: query, $options: "i"}}
            ],
        });


        if (tracks.length === 0) {
            this.logger.error("track not found")
            return [];
        }

        this.logger.log("finded tracks with")

        return tracks;
    }

    async delete(id: Types.ObjectId): Promise<Types.ObjectId> {
        const track = await this.trackModel.findOneAndDelete({_id: id});

        if(!track) {
            this.logger.error("track not found")
            throw new NotFoundException("track is not exists");
        }

        this.logger.log("deleted track");

        return track._id;
    }  

    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.trackModel.findById(dto.trackId);
        const comment = await this.commentModel.create({...dto})

        if(!comment) {
            this.logger.error("failed to create comment")
            throw new NotFoundException("fail to create comment");
        }

        if(!track) {
            this.logger.error("track is not exists")
            throw new NotFoundException("track is not exists");
        }

        track.comments.push(comment._id);
        await track.save();

        this.logger.log("added comment");

        return comment;
    }

    async deleteComment(id: Types.ObjectId): Promise<Types.ObjectId> {
        const comment = await this.commentModel.findOneAndDelete({_id: id});

        if(!comment) {
            throw new NotFoundException("comment is not exists")
        }

        await this.trackModel.findByIdAndUpdate(comment.track, {$pull: {comments: id}});

        this.logger.log("deleted comment");

        comment.deleteOne();

        return comment._id;
    }

    async addTrackToAlbum(id: Types.ObjectId, dto: AddTrackDto, audio) {
        const album = await this.albumModel.findById(id);

        this.logger.log(id);   

        const auidoPath = this.fileService.createFile(FileType.AUDIO, audio);
        const track = await this.trackModel.create({...dto, listens: 0, audio: auidoPath, album: id});

        if(!album) {
            throw new NotFoundException("failed to find album by id");
        }

        album.tracks.push(track._id);
        await album.save();

        this.logger.log("track added to album")

        return track;
    }

    async listen(id: Types.ObjectId) {
        const track = await this.trackModel.findById({_id: id});

        if(!track) {
            throw new NotFoundException("track not found")
        }

        track.listens += 1;
        track.save();
    }
}