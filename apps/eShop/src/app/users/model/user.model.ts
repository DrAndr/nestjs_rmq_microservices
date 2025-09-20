import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IUser, UserRole } from '@e-shop/interfaces';

@Schema()
export class User extends Document implements IUser {
  @Prop()
  displayName?: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.USER,
  })
  role!: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
