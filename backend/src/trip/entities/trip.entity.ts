import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<TripEntity>;

export interface Trip {
  _id: string;
  image: string;
  title: string;
  description: string
  userId: string;
  username: string;
  userImage: string;
}


@Schema()
export class TripEntity implements Trip {
    _id: string;

    @Prop({
    required: false,
    default: ''
    })
    title: string;

    @Prop({
        required: false,
        default: ''
    })
    description: string

    @Prop({
        required: false,
        default: ''
    })
    image: string;

    @Prop({
        required: false,
        default: ''
    })
    userId: string;

    @Prop({
        required: false,
        default: ''
    })
    username: string;

    @Prop({
        required: false,
        default: ''
    })
    userImage: string;
}

export const TripSchema = SchemaFactory.createForClass(TripEntity);