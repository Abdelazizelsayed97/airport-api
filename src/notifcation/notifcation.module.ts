import { NotifcationService } from './notifcation.service';
import { NotifcationResolver } from './notifcation.resolver';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifcation } from './entities/notifcation.entity';
import { UsersModule } from 'users/users.module';
import { FcmModule } from 'fcm/fcm.module';


@Module({
  providers: [NotifcationResolver, NotifcationService],
  exports: [NotifcationService],
  imports: [
    TypeOrmModule.forFeature([Notifcation]),
    forwardRef(() => FcmModule),
    forwardRef(() => UsersModule),
  ],
})
export class NotifcationModule {}
