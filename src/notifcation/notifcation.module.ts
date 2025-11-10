import { NotifcationService } from './notifcation.service';
import { NotifcationResolver } from './notifcation.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifcation } from './entities/notifcation.entity';
import { UserModule } from '../users/users.module';
import { FcmModule } from 'fcm/fcm.module';
import { Module } from '@nestjs/common';

@Module({
  providers: [NotifcationResolver, NotifcationService],
  exports: [NotifcationService],
  imports: [TypeOrmModule.forFeature([Notifcation]), FcmModule],
})
export class NotifcationModule {}
