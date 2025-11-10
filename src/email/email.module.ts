import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { SendGridService } from "email/sendgrid.services";
import { QueueModule } from "@app/queue/queue.module";
import { EmailWorker } from "./workers/email.worker";


@Module({
  providers: [EmailService, SendGridService, EmailWorker],
  exports: [EmailService, SendGridService],
  imports: [QueueModule],
})
export class EmailModule {}
