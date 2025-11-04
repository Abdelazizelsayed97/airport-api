import { Global, Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.services';
import { join } from 'path';

@Global()
@Module({
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
    FirebaseService,
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
