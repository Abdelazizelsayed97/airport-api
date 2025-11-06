import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);

  constructor(private readonly configService: ConfigService) {
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  }

  async send(
    mail: sgMail.MailDataRequired,
  ): Promise<[sgMail.ClientResponse, {}]> {
    const clientResponse = await sgMail.send(mail);
    this.logger.log(`E-Mail sent to ${mail.to}`);
    return clientResponse;
  }
}
