import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId, Types } from "mongoose";
import { Follow, FollowDocument } from "./schemas/follow.schema";
import { ActivityService } from "src/activity/activity.service";
import { ActivityType } from "src/common/enums/activeType.enum";


@Injectable()
export class SocialService {

    constructor(@InjectModel(Follow.name) private socialModel: Model<FollowDocument>,
                private activityService: ActivityService) {}

    async follow(userId: string, targetId: string) {
        if (targetId === userId) {
            throw new BadRequestException("cannot follow yourself");
        }

        const exists = await this.socialModel.findOne({follower: userId, following: targetId});
        
        if (exists) {
            return exists;
        }

        await this.activityService.create({userId: userId, type: ActivityType.FOLLOW, targetId: targetId});
        
        return await this.socialModel.create({follower: userId, following: targetId});
    }

    // не удаляется
    async unfollow(userId: string, targetId: string) {
        if (targetId === userId) {
            throw new BadRequestException("cannot unfollow yourself");
        }

        const exists = await this.socialModel.findOne({follower: userId, following: targetId});
        
        if (!exists) {
            throw new NotFoundException("user not in following");
        }

        await this.activityService.create({userId: userId, type: ActivityType.UNFOLLOW, targetId: targetId});

        return await this.socialModel.deleteOne({follower: userId, following: targetId});
    }

    async getFollowers(limit = 10, offset = 0, userId: string): Promise<Types.ObjectId[]> {
        const followers = await this.socialModel.find({ following: userId }).skip(offset).limit(limit);

        const userIDs = followers.map(f => f.follower);

        return userIDs;
    }

    async getFollowing(limit = 10, offset = 0, userId: string): Promise<Types.ObjectId[]> {
        const followings = await this.socialModel.find({ follower: userId }).skip(offset).limit(limit);

        const userIDs = followings.map(f => f.following);

        return userIDs;
    }
}