import { Process } from "@nestjs/bull";
import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

import { SendGridService } from "email/sendgrid.services";
import * as fs from "fs";
import * as path from "path";
import { sout } from "users/users.service";

@Processor("email")
export class EmailWorker extends WorkerHost {
  constructor(private readonly sendGridService: SendGridService) {
    super();
    sout("EmailWorker instantiated");
  }

  async process(job: Job, token?: string): Promise<any> {
    sout("Email Worker reached" + job.name);
    const { name, data } = job;
    if (name === "send-verification") {
      const templatePath = path.join(
        __dirname,
        "../../core/templates",
        "verification.temp.html"
      );
      let html = fs.readFileSync(templatePath, "utf8");

      html = html
        .replace("{{username}}", data.user.name)
        .replace("{{verificationCode}}", data.code)
        .replace(
          "{{verificationLink}}",
          `https://yourapp.com/verify?code=${data.code}`
        )
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "AirportApp");

      await this.sendGridService.send({
        to: data.user.email,
        from: process.env.SENDGRID_SENDER_EMAIL!,
        subject: "Verify your email address",
        html,
      });
    } else if (name === "status-notification") {
      const templatePath = path.join(
        __dirname,
        "../../core/templates",
        "notification.temp.html"
      );
      let html = fs.readFileSync(templatePath, "utf8");

      html = html
        .replace("{{flightName}}", data.user.name)
        .replace("{{flightStatus}}", data.entityName)
        .replace("{{oldStatus}}", data.oldStatus)
        .replace("{{newStatus}}", data.newStatus)
        .replace("{{detailsLink}}", `https://yourapp.com/${data.entityName}`)
        .replace("{{year}}", new Date().getFullYear().toString())
        .replace("{{appName}}", "YourApp");

      await this.sendGridService.send({
        to: data.user.email,
        from: process.env.SENDGRID_SENDER_EMAIL!,
        subject: `${data.entityName} Status Updated`,
        html,
      });
    }
    return Promise.resolve(true);
  }
  @OnWorkerEvent("failed")
  onFailed(job: Job, token?: string) {
    console.error(`Job ${job.id} failed with reason: ${job.failedReason}`);
  }

  @OnWorkerEvent("error")
  onError(err: Error) {
    console.error("EmailWorker error:", err);
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job, token?: string) {
    console.log(`Job ${job.id} completed successfully.`);
  }

  @OnWorkerEvent("active")
  onActive(job: Job) {
    console.log(`Job ${job.id} is active`);
  }
}
