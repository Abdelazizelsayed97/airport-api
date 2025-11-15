import { Injectable } from "@nestjs/common";

import { sout } from "users/users.service";
import sgMail from "@sendgrid/mail";

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    sout("SendGrid API Key set" + process.env.SENDGRID_API_KEY!);
  }
  async send(
    mail: sgMail.MailDataRequired
  ): Promise<[sgMail.ClientResponse, {}]> {
    try {
      return await sgMail.send(mail);
    } catch (e) {
      sout("Error sending email: " + e);
      throw new Error(e);
    }
  }
}
