import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async addVerificationEmailJob(data: any) {
    await this.emailQueue.add('send-verification', data, {
      removeOnComplete: true,
      attempts: 3,
    });
  }

  async addStatusNotificationJob(data: any) {
    await this.emailQueue.add('status-notification', data, {
      removeOnComplete: true,
      attempts: 3,
    });
  }
}