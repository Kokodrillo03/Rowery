import { Controller, Get, Query } from '@nestjs/common'
import { AddUserImageDto } from './dto/addUserImageDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Get('imageUpload')
    addUserImage(@Query() createUserDto: AddUserImageDto) {
        return this.userService.addUserImage(createUserDto);
    }

    @Get('picture/:userId')
    getUserImage(@Query('userId') userId: string) {
        return this.userService.getUserImage(userId);
    }
}