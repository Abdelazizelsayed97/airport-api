import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import MailService = require("@sendgrid/mail/src/mail");
import { sout } from "users/users.service";

@Injectable()
export class SendGridService {
  constructor(private readonly configService: ConfigService) {
    MailService.setApiKey(process.env.SENDGRID_API_KEY!);
    sout("SendGrid API Key set" + process.env.SENDGRID_API_KEY);
    MailService.setTwilioEmailAuth(
      process.env.SENDGRID_SENDER_EMAIL!,
      "Aa12345678@"
    );
  }

  async send(
    mail: MailService.MailDataRequired
  ): Promise<[MailService.ClientResponse, {}]> {
    return await MailService.send(mail);
  }
}
