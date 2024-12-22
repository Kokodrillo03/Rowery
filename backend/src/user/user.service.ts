import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose';
import { UserEntity } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const createdUser = new this.userModel(createUserDto);
        return await createdUser.save();
    }
}