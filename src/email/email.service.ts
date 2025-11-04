import { SendGridService } from 'email/sendgrid.services';
import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  constructor(readonly sgm: SendGridService) {}

  async sendVerificationEmail(user: any, code: string) {
    const templatePath = path.join(
      __dirname,
      'templates',
      'notification.temp.html',
    );
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html
      .replace('{{username}}', user.name)
      .replace('{{verificationCode}}', code)
      .replace(
        '{{verificationLink}}',
        `https://yourapp.com/verify?code=${code}`,
      )
      .replace('{{year}}', new Date().getFullYear().toString())
      .replace('{{appName}}', 'YourApp');

    await sgMail.send({
      to: user.email,
      from: process.env.SENDGRID_SENDER_EMAIL!,
      subject: 'Verify your email address',
      html,
    });
  }

  async sendStatusNotification(
    user: any,
    entityName: string,
    oldStatus: string,
    newStatus: string,
  ) {
    const templatePath = path.join(
      __dirname,
      'templates',
      'notification.temp.html',
    );
    let html = fs.readFileSync(templatePath, 'utf8');

    html = html
      .replace('{{flightName}}', user.name)
      .replace('{{flightStatus}}', entityName)
      .replace('{{oldStatus}}', oldStatus)
      .replace('{{newStatus}}', newStatus)
      .replace('{{detailsLink}}', `https://yourapp.com/${entityName}`)
      .replace('{{year}}', new Date().getFullYear().toString())
      .replace('{{appName}}', 'YourApp');

    await sgMail.send({
      to: user.email,
      from: process.env.SENDER_EMAIL!,
      subject: `${entityName} Status Updated`,
      html,
    });
  }
}
