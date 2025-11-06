import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendGridService } from 'email/sendgrid.services';
import { QueueModule } from '@app/queue/queue.module';

@Module({
  providers: [EmailService, SendGridService],
  exports: [EmailService],
  imports: [QueueModule],
})
export class EmailModule {}
