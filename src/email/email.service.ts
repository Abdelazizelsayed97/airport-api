import { SendGridService } from 'email/sendgrid.services';
import { Injectable } from '@nestjs/common';
import { QueueService } from 'app/queue/queue.service';

@Injectable()
export class EmailService {
  constructor(
    readonly sgm: SendGridService,
    readonly queueService: QueueService,
  ) {}

  async sendVerificationEmail(user: any, code: string) {
    await this.queueService.addVerificationEmailJob({ user, code });
  }

  async sendStatusNotification(
    user: any,
    entityName: string,
    oldStatus: string,
    newStatus: string,
  ) {
    await this.queueService.addStatusNotificationJob({
      user,
      entityName,
      oldStatus,
      newStatus,
    });
  }
}
