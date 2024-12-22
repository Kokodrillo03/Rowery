import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity>;

export interface User {
  id: string;
  bio: string;
  image: string;
  trips: string[]
}

@Schema()
export class UserEntity implements User {
    @Prop({
    required: true,
    })
    id: string;


    @Prop({
    required: false,
    default: ''
    })
    bio: string;

    @Prop({
        required: false,
        default: []
    })
    trips: string[]

    @Prop({
        required: false,
        default: ''
    })
    image: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);