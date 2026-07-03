import { Module } from "@nestjs/common";
import { TrackController } from "./track.controller";
import { TrackService } from "./track.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Track, TrackSchema } from "./schemas/track.schema";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { FileModule } from "src/file/file.module";
import { Album, AlbumSchema } from "src/album/schemas/album.schema";
import { ActivityModule } from "src/activity/activity.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
        MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
        FileModule,
        ActivityModule,
    ],
    controllers: [TrackController],
    providers: [TrackService]
})
export class TrackModule {

}