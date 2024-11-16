import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  img?: string;

  @Prop()
  name?: string;

  @Prop({unique: true })
  email?: string;

  @Prop({unique: true })
  username?: string;

  @Prop()
  password?: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;
}


export const UserSchema = SchemaFactory.createForClass(User);
