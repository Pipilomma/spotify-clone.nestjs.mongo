import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FollowDocument = HydratedDocument<Follow>;

@Schema()
export class Follow {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  follower!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  following!: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);