import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { AuthzModule } from './authz/authz.module'
import { UserModule } from './user/user.module'
import { TripModule } from './trip/trip.module'


@Module({
  imports: [
    AuthzModule,
    ConfigModule.forRoot(),
    UserModule,
    TripModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => {
        const mongooseUri = process.env.MONGOOSE_URI;
        if (mongooseUri) {
          return {
            uri: mongooseUri,
          };
        }
        console.log('Fetching secret');
        const secretsManager = new SecretsManagerClient();
        const { SecretString: password } = await secretsManager.send(
          new GetSecretValueCommand({ SecretId: process.env.MONGO_SECRET_ID }),
        );
        return {
          user: process.env.MONGO_USER,
          pass: password,
          dbName: process.env.MONGO_DB_NAME,
          uri: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
          tlsCAFile: pemLocation,
          tls: true,
          replicaSet: process.env.MONGO_REPLICA_SET,
          readPreference: process.env.MONGO_READ_PREFERENCE as MongooseModuleFactoryOptions['readPreference'],
          retryWrites: process.env.MONGO_RETRY_WRITES === 'true',
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
