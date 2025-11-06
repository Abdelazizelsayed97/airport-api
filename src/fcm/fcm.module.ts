import { forwardRef, Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmResolver } from './fcm.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fcm } from './entities/fcm.entity';
import { UsersModule } from 'users/users.module';
import { join } from 'path';
import * as admin from 'firebase-admin';

@Module({
  imports: [TypeOrmModule.forFeature([Fcm]), forwardRef(() => UsersModule)],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: () => {
        const serviceAccount = require(
          join(process.cwd(), process.env.Firebase_Admin_Credentials as string),
        );
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
    },

    FcmResolver,
    FcmService,
  ],
  exports: [FcmService],
})
export class FcmModule {}
