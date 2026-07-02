import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Track } from './track.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  user_id!: string;

  @Prop()
  text!: string;

  @Prop()
  owner!: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: "Track"})
  track!: Track;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);