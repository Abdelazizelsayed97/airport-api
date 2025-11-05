import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendGridService } from 'email/sendgrid.services';
import * as SendGrid from '@sendgrid/mail';
import { MailService } from '@sendgrid/mail';
import { QueueModule } from '@app/queue/queue.module';

@Module({
  providers: [EmailService, SendGridService, MailService],
  exports: [EmailService, MailService],
  imports: [QueueModule],
})
export class EmailModule {}
