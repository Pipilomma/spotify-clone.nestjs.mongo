import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Activity, ActivitySchema } from "./schemas/activity.schema";
import { ActivityController } from "./activity.controller";
import { ActivityService } from "./activity.service";
import { Follow, FollowSchema } from "src/social/schemas/follow.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Activity.name, schema: ActivitySchema}]),
        MongooseModule.forFeature([{name: Follow.name, schema: FollowSchema}]),
    ],
    controllers: [ActivityController],
    providers: [ActivityService],
    exports: [ActivityService]
})
export class ActivityModule {

}