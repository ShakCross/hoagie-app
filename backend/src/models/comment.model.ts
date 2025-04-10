import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.model';
import { Hoagie } from './hoagie.model';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  text: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Hoagie', required: true })
  hoagie: Hoagie;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment); 