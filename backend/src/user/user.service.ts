import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddUserImageDto } from './dto/addUserImageDto';
import * as AWS from 'aws-sdk'

@Injectable()
export class UserService {
    constructor() {}

    async addUserImage(addUserImageDto: AddUserImageDto): Promise<{ s3Url: string; uploadUrl: string }> {
        const s3 = new AWS.S3({
            region: 'us-east-1',
        });
        console.log(addUserImageDto);
        // Generate a pre-signed URL for the trip image upload
        const s3Params = {
            Bucket: process.env.ASSETS_BUCKET, // Your bucket name
            Key: `users/${addUserImageDto.userId.toString()}/image`, // File path in bucket
            Expires: 60 * 5, // URL expiry time in seconds
            ContentType: addUserImageDto.imgContentType
        };
        
        const uploadUrl = await s3.getSignedUrlPromise('putObject', s3Params);
        const s3Url = `https://s3.us-east-1.amazonaws.com/${s3Params.Bucket}/${s3Params.Key}`;
        return {
            uploadUrl,
            s3Url
        };
    }
}