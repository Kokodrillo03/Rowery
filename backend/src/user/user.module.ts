import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: AccidentEntity.name, schema: AccidentSchema }]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}