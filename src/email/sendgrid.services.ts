import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { MailService } from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async send(
    mail: SendGrid.MailDataRequired,
  ): Promise<[SendGrid.ClientResponse, {}]> {
    const clientResponse = await this.mailService.send(mail);
    this.logger.log(`E-Mail sent to ${mail.to}`);
    return clientResponse;
  }
}
