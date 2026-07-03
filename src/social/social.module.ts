import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Follow, FollowSchema } from "./schemas/follow.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { SocialController } from "./social.controller";
import { SocialService } from "./social.service";
import { Activity, ActivitySchema } from "src/activity/schemas/activity.schema";
import { ActivityModule } from "src/activity/activity.module";

@Module({
    imports: [
        ActivityModule,
        MongooseModule.forFeature([{name: Follow.name, schema: FollowSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Activity.name, schema: ActivitySchema}])
    ],
    controllers: [SocialController],
    providers: [SocialService]
})
export class SocialModule {

}