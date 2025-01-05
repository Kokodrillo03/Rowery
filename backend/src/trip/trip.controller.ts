import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common'
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/createTrip.dto';
import { Param } from '@nestjs/common';
import { UpdateTripDto } from './dto/updateTrip.dto';
import { GetUsersTripDto } from './dto/getUsersTrip.dto';

@Controller('trip')
export class TripController {
    constructor(private readonly tripService: TripService) {}

    @Post()
    createTrip(@Body() createTripDto: CreateTripDto) {
        return this.tripService.createTrip(createTripDto);
    }

    @Patch(':id')
    updateTrip(@Param() id: string, @Body() updateTripDto: UpdateTripDto) {
        return this.tripService.updateTrip(id, updateTripDto);
    }

    @Get('/user/:userId')
    getUsersTrips(@Param() userId: GetUsersTripDto) {
        return this.tripService.getUsersTrips(userId);
    }

    @Get(':id')
    getTrip(@Param() id: string) {
        return this.tripService.getTrip(id);
    }

    @Get()
    getAllTrips() {
        return this.tripService.getAllTrips();
    }
}

