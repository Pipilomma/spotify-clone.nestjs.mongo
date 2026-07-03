import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  targetId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Track' })
  trackId?: Types.ObjectId;

  @Prop()
  type!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);