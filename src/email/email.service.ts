import { Injectable } from "@nestjs/common";
import { QueueService } from "app/queue/queue.service";


@Injectable()
export class EmailService {
  constructor(readonly queueService: QueueService) {}

  async sendVerificationEmail(user: any, code: string) {

    await this.queueService.addVerificationEmailJob({ user, code });
  }

  async sendStatusNotification(
    user: any,
    entityName: string,

    newStatus: string
  ) {
    await this.queueService.addStatusNotificationJob({
      user,
      entityName,
      newStatus,
    });
  }
}