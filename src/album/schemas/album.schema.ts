import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop()
  name!: string;

  @Prop()
  artist!: string;
  
  @Prop()
  cover!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Track' }]})
  tracks!: Types.ObjectId[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);