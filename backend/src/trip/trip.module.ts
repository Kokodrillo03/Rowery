import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { TripService } from './trip.service'
import { TripController } from './trip.controller'

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: AccidentEntity.name, schema: AccidentSchema }]),
  ],
  providers: [TripService],
  controllers: [TripController],
})
export class TripModule {}