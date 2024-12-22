import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TripEntity } from './entities/trip.entity';
import { UpdateTripDto } from './dto/updateTrip.dto';
import { CreateTripDto } from './dto/createTrip.dto';

@Injectable()
export class TripService {

    constructor(
        @InjectModel(TripEntity.name) private tripModel: Model<TripEntity>,
    ) {}

    async createTrip(createTripDto: CreateTripDto): Promise<TripEntity> {
        const createdTrip = new this.tripModel(createTripDto);
        return await createdTrip.save();
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
}