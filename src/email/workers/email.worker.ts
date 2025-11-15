import { emailQueue, verification, statusNotification } from "@core/constants";
import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bullmq";
import { SendGridService } from "email/sendgrid.services";

import * as fs from "fs";
import { NodeMailerService } from "nodemailer/node.mailer.service";
import * as path from "path";
import { sout } from "users/users.service";

@Processor(emailQueue)
export class EmailWorker extends WorkerHost implements OnModuleInit {
  constructor(
    private readonly sendGridService: SendGridService,
    private readonly config: ConfigService
  ) {
    super();
  }
  onModuleInit() {
    console.log("✅ EmailWorker initialized and ready to process jobs");
  }

  async process(job: Job<any, any, string>): Promise<any> {
    sout("Email Worker reached: " + job.name);
    console.log("Job name:", job.name);
    console.log("Expected names:", { verification, statusNotification });

    switch (job.name) {
      case verification:
        return await this.processVerification(job);
      case statusNotification:
        return await this.processStatusNotification(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  async processVerification(job: Job<any, any, string>): Promise<any> {
    sout("Processing verification job: " + job.id);
    const { data } = job;
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
      // htmlContent: html,
      subject: "Verify your email address",
      // textContent: "Verify your email address",
      html,
      from: "kareem.alsayed009@gmail.com",
    });

    return { success: true };
  }

  async processStatusNotification(job: Job<any, any, string>): Promise<any> {
    const { data } = job;
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
      .replace(
        "{{detailsLink}}",
        `https://${process.env.APP_NAME}.com/${data.entityName}`
      )
      .replace("{{year}}", new Date().getFullYear().toString())
      .replace("{{appName}}", "AirportApp");

    await this.sendGridService.send({
      to: data.user.email,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      subject: `${data.entityName} Status Updated`,
      html,
    });

    return { success: true };
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job, err: Error) {
    console.error(`Job ${job.id} failed with reason: ${err.message}`);
  }

  @OnWorkerEvent("error")
  onError(err: Error) {
    console.error("EmailWorker error:", err);
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job) {
    console.log(`Job ${job.id} completed successfully.`);
  }

  @OnWorkerEvent("active")
  onActive(job: Job) {
    console.log(`Job ${job.id} is active`);
  }
}
