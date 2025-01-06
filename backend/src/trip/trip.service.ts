import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripEntity } from './entities/trip.entity';
import { UpdateTripDto } from './dto/updateTrip.dto';
import { CreateTripDto } from './dto/createTrip.dto';
import * as AWS from 'aws-sdk';
import { GetUsersTripDto } from './dto/getUsersTrip.dto';
import { GetTripDto } from './dto/getTrip.dto';

@Injectable()
export class TripService {

    constructor(
        @InjectModel(TripEntity.name) private tripModel: Model<TripEntity>,
    ) {}

    async createTrip(createTripDto: CreateTripDto): Promise<{uploadUrl: string}> {
        try {
            const newTrip = {
                ...createTripDto,
                userImage: createTripDto.userId
            }
            const createdTrip = new this.tripModel(createTripDto);
            const savedTrip = await createdTrip.save();

            // Configure AWS S3 client
            const s3 = new AWS.S3({
                region: 'us-east-1',
            });

            const s3Params = {
                Bucket: process.env.ASSETS_BUCKET,
                Key: `trips/${savedTrip._id.toString()}/image`,
                Expires: 60 * 5,
                ContentType: createTripDto.imgContentType,
            };

            const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

            const imageUrl = `https://s3.us-east-1.amazonaws.com/${s3Params.Bucket}/${s3Params.Key}`;
            await this.tripModel.findByIdAndUpdate(
              savedTrip._id,
              { image: imageUrl }
            );

            return {
                uploadUrl
            };
        } catch (error) {
            console.log(error)
            throw new Error('Error creating trip and generating upload URL');
        }
    }

    async updateTrip(id: string, updateTripDto: UpdateTripDto): Promise<TripEntity> {
        const updatedTrip = await this.tripModel.findByIdAndUpdate(id, updateTripDto, { new: true });
        return updatedTrip;
    }

    async getTrip(getTripDto: GetTripDto): Promise<TripEntity> {
        return await this.tripModel.findById(getTripDto.id);
    }

    async getUsersTrips(getUsersTripDto: GetUsersTripDto): Promise<TripEntity[]> {
        return await this.tripModel.find({ userId: getUsersTripDto.userId });
    }

    async getAllTrips(): Promise<TripEntity[]> {
        return await this.tripModel.find();
    }
}