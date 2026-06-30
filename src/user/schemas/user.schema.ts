import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id!: Types.ObjectId;

  @Prop()
  username!: string;

  @Prop()
  email!: string;

  @Prop()
  password_hash!: string;

  @Prop()
  role!: string;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);