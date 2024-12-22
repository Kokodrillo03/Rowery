import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TripService } from './trip.service'
import { TripController } from './trip.controller'
import { TripEntity } from './entities/trip.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TripEntity.name, schema: TripEntity }]),
  ],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule {}