import { Module } from "@nestjs/common";
import { TrackModule } from "./track/track.module";
import { MongooseModule } from "@nestjs/mongoose";
import { FileModule } from "./file/file.module";
import { ServeStaticModule } from '@nestjs/serve-static';
import { LoggerModule } from 'nestjs-pino';
import * as path from "path";
import { AlbumModule } from "./album/album.module";
import dotenv from 'dotenv';
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ActivityModule } from "./activity/activity.module";
import { SocialModule } from "./social/social.module";

dotenv.config();

const uri = process.env.MONGO_URI || "";

@Module({
   imports:[
    AlbumModule,
    TrackModule,
    FileModule,
    UserModule,
    AuthModule,
    SocialModule,
    ActivityModule,
    MongooseModule.forRoot(uri),
    ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, "file", "static")}),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    })
  ]
})
export class AppModule {

}