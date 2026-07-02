import { Types } from "mongoose";

export class CreateCommentDto {
    readonly user_id!: string;
    readonly text!: string;
    readonly trackId!: Types.ObjectId;
}