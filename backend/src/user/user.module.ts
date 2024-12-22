import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from './entities/user.entity'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserEntity }]),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}