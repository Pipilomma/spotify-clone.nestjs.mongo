import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Album, AlbumSchema } from "./schemas/album.schema";
import { Track, TrackSchema } from "src/track/schemas/track.schema";
import { FileModule } from "src/file/file.module";
import { AlbumController } from "./album.controller";
import { AlbumService } from "./album.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Album.name, schema: AlbumSchema}]),
        MongooseModule.forFeature([{name: Track.name, schema: TrackSchema}]),
        FileModule
    ],
    controllers: [AlbumController],
    providers: [AlbumService]
})
export class AlbumModule {

}