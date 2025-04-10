import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.model';

export type HoagieDocument = Hoagie & Document;

@Schema({ timestamps: true })
export class Hoagie {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [String] })
  ingredients: string[];

  @Prop()
  picture: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creator: User;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  collaborators: User[];

  // We'll track comment count in the hoagie document for efficient retrieval
  @Prop({ default: 0 })
  commentCount: number;
}

export const HoagieSchema = SchemaFactory.createForClass(Hoagie); 