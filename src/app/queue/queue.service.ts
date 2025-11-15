import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
  
import { Queue } from "bullmq";

import { sout } from "users/users.service";

import { emailQueue, statusNotification, verification } from "@core/constants";

@Injectable()
export class QueueService {
  constructor(@InjectQueue(emailQueue) private emailQueue: Queue) {}

  async addVerificationEmailJob(data: any) {
    sout("Queueing verification email for user: " + data.user.email);
    const job = await this.emailQueue.add(verification, data, {
      removeOnComplete: true,
      attempts: 3,
    });
    sout("Job added to email queue: " + job.id);
  }

  async addStatusNotificationJob(data: any) {
    await this.emailQueue.add(statusNotification, data, {
      removeOnComplete: true,
      attempts: 3,
    });
  }
}
