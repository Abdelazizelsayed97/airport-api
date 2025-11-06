import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotifcationModule } from 'notifcation/notifcation.module';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      {
        name: 'email',
        limiter: {
          max: 400,
          duration: 60000,
        },
      },
      {
        name: 'notification',
      },
    ),
    NotifcationModule,
  ],
  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {
  constructor() {
    console.log('QueueModule');
  }
}
