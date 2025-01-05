import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripEntity } from './entities/trip.entity';
import { UpdateTripDto } from './dto/updateTrip.dto';
import { CreateTripDto } from './dto/createTrip.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class TripService {

    constructor(
        @InjectModel(TripEntity.name) private tripModel: Model<TripEntity>,
    ) {}

    async createTrip(createTripDto: CreateTripDto): Promise<{uploadUrl: string}> {
        try {
            const createdTrip = new this.tripModel(createTripDto);
            const savedTrip = await createdTrip.save();

            // Configure AWS S3 client
            const s3 = new AWS.S3({
                region: 'us-east-1',
            });

            const s3Params = {
                Bucket: process.env.ASSETS_BUCKET, // Your bucket name
                Key: `trips/${savedTrip._id.toString()}/image`, // File path in bucket
                Expires: 60 * 5, // URL expiry time in seconds
                ContentType: 'image/*', // Expected content type
            };

            const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);

            const imageUrl = `https://${s3Params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Params.Key}`;
            await this.tripModel.findByIdAndUpdate(
              savedTrip._id,
              { image: imageUrl },
              { new: true },
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

    async getTrip(id: string): Promise<TripEntity> {
        return await this.tripModel.findById(id);
    }

    async getUsersTrips(userId: string): Promise<TripEntity[]> {
        return await this.tripModel.find({ userId });
    }

    async getAllTrips(): Promise<TripEntity[]> {
        return await this.tripModel.find();
    }
}