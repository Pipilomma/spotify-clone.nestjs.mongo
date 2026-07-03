import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Follow } from "src/social/schemas/follow.schema";
import { Activity } from "./schemas/activity.schema";
import { AddActiveDto } from "./dto/add-activity.dto";

@Injectable()
    export class ActivityService {
        constructor(
        @InjectModel(Activity.name) private activityModel: Model<Activity>,
    ) {}

    async create(dto: AddActiveDto) {
        return this.activityModel.create({userId: dto.userId, targetId: dto.targetId, trackId: dto.trackId, type: dto.type});
    }

    async getMyActivity(limit = 10, offset = 0, userId: string) {
        return this.activityModel.find({userId: userId}).skip(offset).limit(limit);
    }
}