import { Injectable, NotFoundException, Logger, InternalServerErrorException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Track, TrackDocument } from "./schemas/track.schema";
import { Model, ObjectId, Types } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import { CreateTrackDto } from "./dto/create-track.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FileService } from "../file/file.service";
import { AddTrackDto } from "./dto/add-track.dto";
import { Album, AlbumDocument } from "src/album/schemas/album.schema";
import { ActivityService } from "../activity/activity.service";
import { ActivityType } from "../common/enums/activeType.enum"
import { FileToSaveType } from "../common/enums/fileType.enum"


@Injectable()
export class TrackService {
    constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>,
                @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
                @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
                private fileService: FileService,
                private activityService: ActivityService) {}

    async create(dto: CreateTrackDto, userId: string, artistName: string, audio, cover): Promise<Track> {
        const auidoPath = this.fileService.createFile(FileToSaveType.AUDIO, audio);
        const coverPath = this.fileService.createFile(FileToSaveType.IMAGE, cover);
        const track = await this.trackModel.create({...dto, artist: artistName, owner: userId, listens: 0, audio: auidoPath, cover: coverPath});

        return track;
    }

    async getOne(id: ObjectId): Promise<Track> {
        const track = await this.trackModel.findById(id).populate("comments");

        if(!track) {
            throw new NotFoundException("track not found");
        }

        return track;
    }

    async getAll(limit = 10, offset = 0): Promise<Track[]> {
        const tracks = await this.trackModel.find().skip(offset).limit(limit);

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
            return [];
        }

        return tracks;
    }

    async delete(id: Types.ObjectId, ownerId: string): Promise<Types.ObjectId> {
        const track = await this.trackModel.findOne({_id: id});

        if(!track) {
            throw new NotFoundException("track is not exists");
        }

        if(track.owner.toString() !== ownerId) {
            throw new ForbiddenException("don't have the rights to do this")
        }

        await track.deleteOne({_id: id});

        return track._id;
    }  

    async addComment(dto: CreateCommentDto): Promise<Comment> {
        const track = await this.trackModel.findOne({_id: dto.trackId});

        console.log(track)

        if(!track) {
            throw new NotFoundException("track is not exists");
        }

        const comment = await this.commentModel.create({...dto})

        if(!comment) {
            throw new InternalServerErrorException("fail to create comment");
        }

        track.comments.push(comment._id);
        await track.save();

        return comment;
    }

    async deleteComment(id: Types.ObjectId, ownerId: string): Promise<Types.ObjectId> {
        const comment = await this.commentModel.findOne({_id: id});

        if(!comment) {
            throw new NotFoundException("comment is not exists")
        }

        if(comment.owner.toString() !== ownerId) {
            throw new ForbiddenException("don't have the rights to do this")
        }

        await this.trackModel.findByIdAndUpdate(comment.track, {$pull: {comments: id}});

        comment.deleteOne();

        return comment._id;
    }

    async addTrackToAlbum(id: Types.ObjectId, dto: AddTrackDto, ownerId: string, audio) {
        const album = await this.albumModel.findById(id);

        if(!album) {
            throw new NotFoundException("failed to find album by id");
        }

        if(album.owner.toString() !== ownerId) {
            throw new ForbiddenException("don't have the rights to do this")
        }

        const auidoPath = this.fileService.createFile(FileToSaveType.AUDIO, audio);
        const track = await this.trackModel.create({name: dto.name, artist: album.artist, listens: 0, audio: auidoPath, album: id, owner: album.owner.toString()});

        if(!track) {
            throw new InternalServerErrorException("failed to create track by album");
        }

        album.tracks.push(track._id);
        await album.save();

        return track;
    }

    async listen(trackId: Types.ObjectId, userId: string) {
        const track = await this.trackModel.findByIdAndUpdate(trackId, { $inc: { listens: 1 }}, { new: true} );

        if (!track) {
            throw new NotFoundException("track not found");
        }

        await this.activityService.create({userId: userId, type: ActivityType.LISTEN, trackId: trackId.toString()});

        return track;
    }
}