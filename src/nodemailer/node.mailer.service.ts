import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class NodeMailerService {
  constructor() {}

  async transport() {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,

      },

    });
    return transporter;
  }
  async send(mail: nodemailer.SendMailOptions) {
    const transporter = await this.transport();
    return await transporter.sendMail(mail);
  }
}
