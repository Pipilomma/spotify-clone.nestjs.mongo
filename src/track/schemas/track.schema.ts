import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TrackDocument = HydratedDocument<Track>;

@Schema()
export class Track {
  @Prop()
  name!: string;
  
  @Prop()
  artist!: string;

  @Prop()
  text!: string;

  @Prop()
  listens!: number;

  @Prop()
  cover!: string;

  @Prop()
  audio!: string;

  @Prop({ type: Types.ObjectId, ref: 'Album' })
  album?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }]})
  comments!: Types.ObjectId[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);