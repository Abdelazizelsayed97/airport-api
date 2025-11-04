import { Injectable } from '@nestjs/common';
import { CreateFirebaseInput } from './dto/create-firebase.input';
import { UpdateFirebaseInput } from './dto/update-firebase.input';

@Injectable()
export class FirebaseService {
  async sendNotification(params: any): Promise<any> {
    return '';
  }
}
