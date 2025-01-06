import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TripService } from './trip.service'
import { TripController } from './trip.controller'
import {TripEntity, TripSchema} from './entities/trip.entity'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TripEntity.name, schema: TripSchema }]),
    HttpModule
  ],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule {}