import { Injectable } from "@nestjs/common";
import { QueueService } from "app/queue/queue.service";
import { sout } from "users/users.service";

@Injectable()
export class EmailService {
  constructor(readonly queueService: QueueService) {}

  async sendVerificationEmail(user: any, code: string) {
    sout("Queueing verification email for user: " + user.email);
    await this.queueService.addVerificationEmailJob({ user, code });
  }

  async sendStatusNotification(
    user: any,
    entityName: string,
    oldStatus: string,
    newStatus: string
  ) {
    await this.queueService.addStatusNotificationJob({
      user,
      entityName,
      oldStatus,
      newStatus,
    });
  }
}